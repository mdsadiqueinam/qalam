/**
 * Keyboard Layout Constants
 * 
 * Standard keyboard scan codes organized by physical rows.
 * Used for detecting and rendering keyboard layouts via the Keyboard API.
 */

/**
 * Standard keyboard rows by scan codes/positions
 * Based on standard ANSI keyboard layout
 */
export const KEYBOARD_ROWS = [
  // Row 1 (number row + special chars)
  [
    "Backquote",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Minus",
    "Equal",
  ],
  // Row 2 (QWERTY row)
  [
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "BracketLeft",
    "BracketRight",
    "Backslash",
  ],
  // Row 3 (ASDF row)
  [
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "Semicolon",
    "Quote",
  ],
  // Row 4 (ZXCV row)
  [
    "KeyZ",
    "KeyX",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyN",
    "KeyM",
    "Comma",
    "Period",
    "Slash",
  ],
];

/**
 * Fallback QWERTY layout keys
 * Used when Keyboard API is not supported
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
 * (Future implementation - currently not used)
 */
export const ARABIC_KEYBOARD_MAPPING = {
  // Row 2 (QWERTY)
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

  // Row 3 (ASDF)
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

  // Row 4 (ZXCV)
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
