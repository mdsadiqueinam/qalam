/**
 * Keyboard Layout Constants
 *
 * Standard keyboard scan codes organized by physical rows.
 * Used for detecting and rendering keyboard layouts via the Keyboard API.
 *
 * Key types:
 *   'char'    - regular typeable key (looked up from Keyboard API)
 *   'special' - non-typeable key with a fixed label
 */

/**
 * Full keyboard layout rows including special keys.
 * Each key is an object: { code, type, label?, width? }
 *   - code:   KeyboardEvent.code value
 *   - type:   'char' | 'special'
 *   - label:  display label for special keys
 *   - width:  optional Tailwind width class override
 */
export const KEYBOARD_LAYOUT = [
  // Row 0: Number row
  [
    { code: "Backquote", type: "char" },
    { code: "Digit1", type: "char" },
    { code: "Digit2", type: "char" },
    { code: "Digit3", type: "char" },
    { code: "Digit4", type: "char" },
    { code: "Digit5", type: "char" },
    { code: "Digit6", type: "char" },
    { code: "Digit7", type: "char" },
    { code: "Digit8", type: "char" },
    { code: "Digit9", type: "char" },
    { code: "Digit0", type: "char" },
    { code: "Minus", type: "char" },
    { code: "Equal", type: "char" },
    { code: "Backspace", type: "special", label: "BKSPC", width: "w-20" },
  ],
  // Row 1: QWERTY row
  [
    { code: "KeyQ", type: "char" },
    { code: "KeyW", type: "char" },
    { code: "KeyE", type: "char" },
    { code: "KeyR", type: "char" },
    { code: "KeyT", type: "char" },
    { code: "KeyY", type: "char" },
    { code: "KeyU", type: "char" },
    { code: "KeyI", type: "char" },
    { code: "KeyO", type: "char" },
    { code: "KeyP", type: "char" },
    { code: "BracketLeft", type: "char" },
    { code: "BracketRight", type: "char" },
    { code: "Backslash", type: "char" },
  ],
  // Row 2: ASDF row
  [
    { code: "KeyA", type: "char" },
    { code: "KeyS", type: "char" },
    { code: "KeyD", type: "char" },
    { code: "KeyF", type: "char" },
    { code: "KeyG", type: "char" },
    { code: "KeyH", type: "char" },
    { code: "KeyJ", type: "char" },
    { code: "KeyK", type: "char" },
    { code: "KeyL", type: "char" },
    { code: "Semicolon", type: "char" },
    { code: "Quote", type: "char" },
    { code: "Enter", type: "special", label: "ENTER", width: "w-24" },
  ],
  // Row 3: ZXCV row
  [
    { code: "ShiftLeft", type: "special", label: "SHIFT", width: "w-20" },
    { code: "KeyZ", type: "char" },
    { code: "KeyX", type: "char" },
    { code: "KeyC", type: "char" },
    { code: "KeyV", type: "char" },
    { code: "KeyB", type: "char" },
    { code: "KeyN", type: "char" },
    { code: "KeyM", type: "char" },
    { code: "Comma", type: "char" },
    { code: "Period", type: "char" },
    { code: "Slash", type: "char" },
    { code: "ShiftRight", type: "special", label: "SHIFT", width: "w-20" },
  ],
  // Row 4: Bottom row
  [
    { code: "ControlLeft", type: "special", label: "CTRL", width: "w-20" },
    { code: "AltLeft", type: "special", label: "ALT", width: "w-20" },
    { code: "Space", type: "special", label: "SPACE", width: "w-96" },
    { code: "AltRight", type: "special", label: "ALT GR", width: "w-20" },
  ],
];

/**
 * Char-only codes (for Keyboard API lookup and key map generation)
 */
export const KEYBOARD_ROWS = KEYBOARD_LAYOUT.map((row) =>
  row.filter((k) => k.type === "char").map((k) => k.code),
);

/**
 * Fallback QWERTY layout keys (char keys only, matching KEYBOARD_ROWS order)
 */
export const FALLBACK_QWERTY_KEYS = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
];

/**
 * Arabic character mapping for transliteration
 * Maps physical keyboard keys to Arabic characters
 */
export const ARABIC_KEYBOARD_MAPPING = {
  // Row 1 (QWERTY)
  Q: "ض",
  W: "ص",
  E: "ث",
  R: "ق",
  T: "ف",
  Y: "غ",
  U: "ع",
  I: "ه",
  O: "خ",
  P: "ح",
  "[": "ج",
  "]": "د",

  // Row 2 (ASDF)
  A: "ش",
  S: "س",
  D: "ي",
  F: "ب",
  G: "ل",
  H: "ا",
  J: "ت",
  K: "ن",
  L: "م",
  ";": "ك",
  "'": "ط",

  // Row 3 (ZXCV)
  Z: "ئ",
  X: "ء",
  C: "ؤ",
  V: "ر",
  B: "لا",
  N: "ى",
  M: "ة",
  ",": "و",
  ".": "ز",
  "/": "ظ",
};

export const SHIFT_MAP = {
  Backquote: "~",
  Digit1: "!",
  Digit2: "@",
  Digit3: "#",
  Digit4: "$",
  Digit5: "%",
  Digit6: "^",
  Digit7: "&",
  Digit8: "*",
  Digit9: "(",
  Digit0: ")",
  Minus: "_",
  Equal: "+",
  BracketLeft: "{",
  BracketRight: "}",
  Backslash: "|",
  Semicolon: ":",
  Quote: '"',
  Comma: "<",
  Period: ">",
  Slash: "?",
};
