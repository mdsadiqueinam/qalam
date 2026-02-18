import Dexie from "dexie";
import relationships from "dexie-relationships";
import { v4 as uuidv4 } from "uuid";
import { capitalizeFirstLetter, singularize } from "@/utils/string";
import CONFIG from "./config";

// ---------------------------------------------------------------------------
// Schema generation
// ---------------------------------------------------------------------------

/**
 * Builds the Dexie stores object from CONFIG.
 * Each table entry becomes either its `customIndex` string or a
 * comma-joined list of indexed field names (with -> references where present).
 */
function getIndexesForDexie() {
  return Object.entries(CONFIG).reduce((indexes, [tableName, tableInfo]) => {
    if (tableInfo?.customIndex) {
      indexes[tableName] = tableInfo.customIndex;
    } else {
      indexes[tableName] = Object.entries(tableInfo.fields)
        .filter(([, field]) => field.index)
        .map(([fieldName, fieldInfo]) =>
          fieldInfo.reference
            ? `${fieldName} -> ${fieldInfo.reference}`
            : fieldName,
        )
        .join(",");
    }
    return indexes;
  }, {});
}

// ---------------------------------------------------------------------------
// Validation & defaults
// ---------------------------------------------------------------------------

/**
 * Iterates a table's field definitions and:
 *  1. Applies default values (plain value or async factory function).
 *  2. Auto-fills `id` with a UUID when absent.
 *  3. Reports missing required fields.
 *
 * Returns `true` when the record is valid, `false` otherwise.
 */
async function applyDefaultsAndValidate(tableDef, record) {
  // Auto-assign a UUID primary key when missing
  if (!record.id) {
    record.id = uuidv4();
  }

  for (const [fieldName, fieldInfo] of Object.entries(tableDef.fields)) {
    if (fieldName === "id") continue;

    const fieldVal = record[fieldName];
    if (fieldVal !== undefined && fieldVal !== null) continue;

    // Apply explicit default (value or factory function)
    if (fieldInfo && "default" in fieldInfo) {
      const def = fieldInfo.default;
      record[fieldName] =
        typeof def === "function"
          ? await def({ fieldName, tableDef, record })
          : def;
      continue;
    }

    // Skip optional fields
    if (!fieldInfo?.required) continue;

    // Built-in fallbacks for common required fields
    if (fieldName === "createdAt") {
      record.createdAt = new Date();
      continue;
    }

    if (fieldName === "updatedAt") {
      record.updatedAt = new Date();
      continue;
    }

    console.error(
      `[db] Missing required field '${fieldName}' on table '${tableDef}'`,
    );
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Database initialisation
// ---------------------------------------------------------------------------

let _db = null;

/**
 * Initialises (or returns the cached) Dexie database instance.
 * Call this once at application startup, then import `db` wherever needed.
 */
export function initDb() {
  if (_db) return _db;

  _db = new Dexie("qalamDb", { addons: [relationships] });

  _db.version(1).stores({
    meta: "name, value",
    transactionQueue: "++id, table, action, objectId, data, oldData",
    ...getIndexesForDexie(),
  });

  setupObjectClasses(_db);

  return _db;
}

// ---------------------------------------------------------------------------
// Object class setup
// ---------------------------------------------------------------------------

function setupObjectClasses(db) {
  // --- TransactionQueueItem ---------------------------------------------------

  const rollbackActions = {
    create: (tx) => db[tx.table].delete(tx.objectId),
    update: (tx) => db[tx.table].update(tx.objectId, tx.oldData),
    delete: (tx) => db[tx.table].add({ ...tx.oldData }),
  };

  const TransactionQueueItemClass = Dexie.defineClass({
    id: String,
    table: String,
    action: String,
    objectId: String,
    data: Object,
    oldData: Object,
  });

  TransactionQueueItemClass.prototype.enqueue = async function () {
    await db.transactionQueue.add(this);
  };

  TransactionQueueItemClass.prototype.rollback = async function () {
    await db.transactionQueue.delete(this.id);
    await rollbackActions[this.action]?.(this);
  };

  db.transactionQueue.mapToClass(TransactionQueueItemClass);
  db.TransactionQueueItem = TransactionQueueItemClass;

  // --- Per-table classes -------------------------------------------------------

  for (const [tableName, tableDef] of Object.entries(CONFIG)) {
    const tableClassName = capitalizeFirstLetter(singularize(tableName));
    const tableClass = Dexie.defineClass(tableDef.fields);

    // create – insert a new record
    tableClass.prototype.create = async function () {
      if (!(await applyDefaultsAndValidate(tableDef, this))) return false;
      await logTransaction(db, tableName, tableDef, "create", this);
      await db[tableName].add(this);
      return true;
    };

    // save – update an existing record
    tableClass.prototype.save = async function () {
      if (!(await applyDefaultsAndValidate(tableDef, this))) return false;
      await logTransaction(db, tableName, tableDef, "update", this);
      await db[tableName].update(this.id, this);
      return true;
    };

    // softDelete – set stateId to DELETED (only when stateId is defined)
    tableClass.prototype.softDelete = async function () {
      if (this.stateId === undefined) {
        throw new Error(
          `'stateId' is not defined on '${tableName}'. Use delete() instead.`,
        );
      }
      this.stateId = "DELETED";
      await logTransaction(db, tableName, tableDef, "update", this);
      await db[tableName].update(this.id, this);
    };

    // restore – set stateId back to ACTIVE
    tableClass.prototype.restore = async function () {
      if (this.stateId === undefined) {
        throw new Error(`'stateId' is not defined on '${tableName}'.`);
      }
      this.stateId = "ACTIVE";
      await logTransaction(db, tableName, tableDef, "update", this);
      await db[tableName].update(this.id, this);
    };

    // delete – hard delete
    tableClass.prototype.delete = async function () {
      await logTransaction(db, tableName, tableDef, "delete", this);
      await db[tableName].delete(this.id);
    };

    db[tableName].mapToClass(tableClass);
    db[tableClassName] = tableClass;
  }
}

// ---------------------------------------------------------------------------
// Transaction logging
// ---------------------------------------------------------------------------

async function logTransaction(db, tableName, tableDef, action, obj) {
  if (!obj.id)
    throw new Error(
      `[db] No id on record when logging '${action}' for '${tableName}'`,
    );

  const oldData = action !== "create" ? await db[tableName].get(obj.id) : {};

  const createItem = (data = {}, oldData = {}) =>
    new db.TransactionQueueItem({
      table: tableName,
      action,
      objectId: obj.id,
      data,
      oldData,
    });

  const handlers = {
    create: async () => {
      const data = Object.fromEntries(
        Object.keys(tableDef.fields)
          .filter((f) => obj[f] !== undefined && f !== "createdAt")
          .map((f) => [f, obj[f]]),
      );
      await createItem(data).enqueue();
    },

    update: async () => {
      const data = {};
      for (const fieldName of Object.keys(tableDef.fields)) {
        const newVal = obj[fieldName];
        const oldVal = oldData?.[fieldName];
        const changed =
          newVal instanceof Date && oldVal instanceof Date
            ? newVal.getTime() !== oldVal.getTime()
            : newVal !== oldVal;
        if (changed) data[fieldName] = newVal;
      }
      if (Object.keys(data).length === 0)
        throw new Error("[db] No changes detected");
      await createItem(data, oldData).enqueue();
    },

    delete: async () => {
      await createItem({}, oldData).enqueue();
    },
  };

  const handler = handlers[action];
  if (!handler) throw new Error(`[db] Unsupported action: ${action}`);
  await handler();
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

/**
 * @type {Dexie & {
 *   books: Dexie.Table<any, string>,
 *   transactionQueue: Dexie.Table<any, string>,
 *   meta: Dexie.Table<any, string>,
 *   Book: any,
 *   TransactionQueueItem: any
 * }}
 */
export const db = initDb();
