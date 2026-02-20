const CONFIG = {
  books: {
    customIndex: "&id, objectId, stateId, userId -> users.id, isPublic",
    fields: {
      id: { index: true, type: String }, // UUID
      title: { index: false, type: String, required: true },
      coverImage: { index: false, type: String },
      content: { index: false, type: String },
      createdAt: { index: true, type: Date, required: true },
      updatedAt: { index: true, type: Date, required: true },
      stateId: { index: true, type: String, default: "ACTIVE" },
      // userId: ID of the Firebase user who owns this book.
      // Set automatically when a user creates a book while authenticated.
      // Guest-created books will have userId = null.
      userId: { index: true, type: String },
      // isPublic: When true the book is readable by all authenticated users.
      // When false (default) only the owning user can access it.
      isPublic: { index: true, type: Boolean, default: false },
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
