import { liveQuery } from "dexie";
import { shallowRef, getCurrentScope, onScopeDispose, watch } from "vue";

/**
 * Utility type that makes a value type optionally undefined based on the presence of a fallback.
 * @template T - The main type.
 * @template I - The fallback type (if provided).
 */
/**
 * @typedef {T | (I extends undefined ? undefined : I)} Value
 * @param {T} T - The main type.
 * @param {I} I - The fallback type (if provided).
 */

/**
 * Options for the useDexieLiveQueryWithDeps hook.
 * @template I - The initial value type (optional).
 * @typedef {Object} UseDexieLiveQueryWithDepsOptions
 * @property {Function} [onError] - Optional error handler function.
 * @property {I} [initialValue] - The initial value of the query.
 * @property {boolean} [immediate=true] - Whether to run the query immediately.
 */

/**
 * Options for the useDexieLiveQuery hook.
 * @template I - The initial value type (optional).
 * @typedef {Object} UseDexieLiveQueryOptions
 * @property {Function} [onError] - Optional error handler function.
 * @property {I} [initialValue] - The initial value of the query.
 */

/**
 * Utility to register cleanup logic for a scope (if available).
 * @param {Function} fn - The cleanup function to execute on scope dispose.
 */
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
  }
}

/**
 * A Vue composition hook to use a live query from Dexie, with the ability to depend on reactive data.
 * @template T - The type of data returned by the query.
 * @template I - The fallback type (optional).
 * @template Immediate - Boolean to indicate whether to run the query immediately (default is true).
 * @param {any} deps - The dependencies to trigger the query.
 * @param {Function} querier - The function that returns a query result.
 * @param {UseDexieLiveQueryWithDepsOptions<I, Immediate>} options - Options to customize the query.
 * @returns {ShallowRef<Value<T, I>>} - A reactive reference holding the query result.
 */
export function useDexieLiveQueryWithDeps(deps, querier, options = {}) {
  const { onError, initialValue, ...rest } = options;

  const value = shallowRef(initialValue);

  let subscription = undefined;

  /**
   * Starts the query and subscribes to changes.
   * @param {any} data - Data passed to the querier function.
   */
  function start(...data) {
    subscription?.unsubscribe();

    const observable = liveQuery(() => querier(...data));

    subscription = observable.subscribe({
      next: (result) => {
        value.value = result;
      },
      error: (error) => {
        onError?.(error);
      },
    });
  }

  /**
   * Cleans up the subscription to avoid memory leaks.
   */
  function cleanup() {
    subscription?.unsubscribe();

    // Set to undefined to avoid calling unsubscribe multiple times on a same subscription
    subscription = undefined;
  }

  watch(deps, start, { immediate: true, ...rest });

  tryOnScopeDispose(() => {
    cleanup();
  });

  return value; // Return as ShallowRef<Value<T, I>>.
}

/**
 * A Vue composition hook to use a live query from Dexie without additional dependencies.
 * @template T - The type of data returned by the query.
 * @template I - The fallback type (optional).
 * @param {Function} querier - The function that returns a query result.
 * @param {UseDexieLiveQueryOptions<I>} options - Options to customize the query.
 * @returns {ShallowRef<Value<T, I>>} - A reactive reference holding the query result.
 */
export function useDexieLiveQuery(querier, options = {}) {
  const { onError, initialValue } = options;

  const value = shallowRef(initialValue);

  let subscription = undefined;

  /**
   * Starts the query and subscribes to changes.
   */
  function start() {
    subscription?.unsubscribe();

    const observable = liveQuery(querier);

    subscription = observable.subscribe({
      next: (result) => {
        value.value = result;
      },
      error: (error) => {
        onError?.(error);
      },
    });
  }

  /**
   * Cleans up the subscription to avoid memory leaks.
   */
  function cleanup() {
    subscription?.unsubscribe();

    // Set to undefined to avoid calling unsubscribe multiple times on a same subscription
    subscription = undefined;
  }

  start();

  tryOnScopeDispose(() => {
    cleanup();
  });

  return value; // Return as ShallowRef<Value<T, I>>.
}
