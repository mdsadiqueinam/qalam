const CONFIG = {
  books: {
    customIndex: "&id, objectId, stateId, userId -> users.id",
    fields: {
      id: { index: true, type: String }, // UUID
      title: { index: false, type: String, required: true },
      coverImage: { index: false, type: String },
      content: { index: false, type: String },
      createdAt: { index: true, type: Date, required: true },
      updatedAt: { index: true, type: Date, required: true },
      stateId: { index: true, type: String, default: "ACTIVE" },
    },
  },
};

function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach((name) => {
    const value = obj[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}

export default deepFreeze(CONFIG);
