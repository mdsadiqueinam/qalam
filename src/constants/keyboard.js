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
 * Arabic key mapping keyed by KeyboardEvent.code.
 * Each entry has:
 *   - default: Arabic character for the unmodified key
 *   - shift:   Arabic character (or punctuation) when Shift is held
 *   - alt:     (optional) alternate Arabic character when Alt is held
 */
export const ARABIC_KEY_MAP = {
  // Row 0: Number row
  Backquote: { default: "ذ", shift: "~", alt: "٪" },
  Digit1: { default: "١", shift: "!" },
  Digit2: { default: "٢", shift: "@" },
  Digit3: { default: "٣", shift: "#" },
  Digit4: { default: "٤", shift: "$" },
  Digit5: { default: "٥", shift: "%" },
  Digit6: { default: "٦", shift: "^" },
  Digit7: { default: "٧", shift: "&" },
  Digit8: { default: "٨", shift: "*" },
  Digit9: { default: "٩", shift: "(" },
  Digit0: { default: "٠", shift: ")" },

  // Row 1: QWERTY row
  KeyQ: { default: "ض", shift: "َ" },
  KeyW: { default: "ص", shift: "ً" },
  KeyE: { default: "ث", shift: "ُ" },
  KeyR: { default: "ف", shift: "إ", alt: "ڤ" },
  KeyT: { default: "ق", shift: "لإ" },
  KeyY: { default: "غ", shift: "إ" },
  KeyU: { default: "ع", shift: "'" },
  KeyI: { default: "ه", shift: "÷" },
  KeyO: { default: "خ", shift: "x" },
  KeyP: { default: "ح", shift: "؛" },
  BracketLeft: { default: "ج", shift: "<" },
  BracketRight: { default: "د", shift: ">" },

  // Row 2: ASDF row
  KeyA: { default: "ش", shift: "ِ" },
  KeyS: { default: "س", shift: "ٍ" },
  KeyD: { default: "ي", shift: "ٰ" },
  KeyF: { default: "ب", shift: "ٖ", alt: "پ" },
  KeyG: { default: "ل", shift: "أ" },
  KeyH: { default: "ا", shift: "آ" },
  KeyJ: { default: "ت", shift: "ـ" },
  KeyK: { default: "ن", shift: "،" },
  KeyL: { default: "م", shift: "/" },
  Semicolon: { default: "ك", shift: ":" },
  Quote: { default: "ط", shift: '"' },

  // Row 3: ZXCV row
  KeyZ: { default: "ئ", shift: "ّ" },
  KeyX: { default: "ء", shift: "ْ" },
  KeyC: { default: "ؤ", shift: "{" },
  KeyV: { default: "ر", shift: "}" },
  KeyB: { default: "لآ", shift: "لأ" },
  KeyN: { default: "ى", shift: "آ" },
  KeyM: { default: "ة", shift: "'" },
  Comma: { default: "و", shift: "," },
  Period: { default: "ز", shift: "." },
  Slash: { default: "ظ", shift: "؟" },
};

/**
 * Arabic 123 key mapping — macOS "Arabic 123" layout.
 * Differences from ARABIC_KEY_MAP:
 *   - Number row: Backquote → ة/ا (not ذ/~)
 *   - ZXCV row:   KeyZ → ذ/ّ, KeyX → د/ْ, KeyC → أ/{, KeyV → ز/}
 *   - All other keys identical to ARABIC_KEY_MAP.
 */
export const ARABIC_123_KEY_MAP = {
  // Row 0: Number row
  Backquote: { default: "ة", shift: "ا" },
  Digit1: { default: "١", shift: "!" },
  Digit2: { default: "٢", shift: "@" },
  Digit3: { default: "٣", shift: "#" },
  Digit4: { default: "٤", shift: "$" },
  Digit5: { default: "٥", shift: "٪" },
  Digit6: { default: "٦", shift: "^" },
  Digit7: { default: "٧", shift: "&" },
  Digit8: { default: "٨", shift: "*" },
  Digit9: { default: "٩", shift: ")" },
  Digit0: { default: "٠", shift: "(" },

  // Row 1: QWERTY row (same as standard)
  KeyQ: { default: "ض", shift: "َ" },
  KeyW: { default: "ص", shift: "ً" },
  KeyE: { default: "ث", shift: "ُ" },
  KeyR: { default: "ف", shift: "إ", alt: "ڤ" },
  KeyT: { default: "ق", shift: "لإ" },
  KeyY: { default: "غ", shift: "إ" },
  KeyU: { default: "ع", shift: "'" },
  KeyI: { default: "ه", shift: "÷" },
  KeyO: { default: "خ", shift: "x" },
  KeyP: { default: "ح", shift: "؛" },
  BracketLeft: { default: "ج", shift: "<" },
  BracketRight: { default: "د", shift: ">" },

  // Row 2: ASDF row (same as standard)
  KeyA: { default: "ش", shift: "ِ" },
  KeyS: { default: "س", shift: "ٍ" },
  KeyD: { default: "ي", shift: "ٰ" },
  KeyF: { default: "ب", shift: "ٖ", alt: "پ" },
  KeyG: { default: "ل", shift: "أ" },
  KeyH: { default: "ا", shift: "آ" },
  KeyJ: { default: "ت", shift: "ـ" },
  KeyK: { default: "ن", shift: "،" },
  KeyL: { default: "م", shift: "/" },
  Semicolon: { default: "ك", shift: ":" },
  Quote: { default: "ط", shift: '"' },

  // Row 3: ZXCV row — differs from standard
  KeyZ: { default: "ذ", shift: "ّ" },
  KeyX: { default: "د", shift: "ْ" },
  KeyC: { default: "أ", shift: "{" },
  KeyV: { default: "ز", shift: "}" },
  KeyB: { default: "لآ", shift: "لأ" },
  KeyN: { default: "ى", shift: "آ" },
  KeyM: { default: "ة", shift: "'" },
  Comma: { default: "و", shift: "," },
  Period: { default: "ر", shift: "." },
  Slash: { default: "ظ", shift: "؟" },
};

/**
 * Available Arabic keyboard layouts.
 * Used by ArabicKeyboard.vue to render the layout selector.
 */
export const ARABIC_LAYOUTS = [
  { id: "standard", label: "Arabic", map: ARABIC_KEY_MAP },
  { id: "arabic123", label: "Arabic 123", map: ARABIC_123_KEY_MAP },
];

/**
 * English shift-key map for digit/symbol keys.
 * Used by utils/keyboard.js to resolve englishKey.shift for non-letter keys.
 */
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
