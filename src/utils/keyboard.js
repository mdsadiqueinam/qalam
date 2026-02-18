import {
  KEYBOARD_ROWS,
  FALLBACK_QWERTY_KEYS,
  SHIFT_MAP,
} from "@root/constants/keyboard";

/**
 * Detects the current keyboard layout using the Keyboard API
 * @returns {Promise<Object>} Layout detection result with layout map, key map, and support status
 */
export async function detectKeyboardLayout() {
  // Check if Keyboard API is supported
  if (!("keyboard" in navigator) || !navigator.keyboard.getLayoutMap) {
    console.warn("Keyboard API not supported, using fallback");
    return {
      supported: false,
      layoutMap: null,
      layout: null,
      keyMap: generateFallbackKeyMap(),
    };
  }

  try {
    const layoutMap = await navigator.keyboard.getLayoutMap();

    // Build keyboard layout from the detected layout
    const layout = KEYBOARD_ROWS.map((row) => {
      return row.map((code) => {
        const key =
          layoutMap.get(code) || code.replace(/^Key/, "").replace(/^Digit/, "");
        return {
          code,
          key: key.toUpperCase(),
          display: key.toUpperCase(),
        };
      });
    });

    const keyMap = generateKeyMap(layoutMap);

    return {
      supported: true,
      layoutMap,
      layout,
      keyMap,
    };
  } catch (error) {
    console.error("Error detecting keyboard layout:", error);
    return {
      supported: false,
      layoutMap: null,
      layout: null,
      keyMap: generateFallbackKeyMap(),
    };
  }
}

/**
 * Identifies the keyboard layout type by checking key positions
 * @param {KeyboardLayoutMap} layoutMap - The keyboard layout map from Keyboard API
 * @returns {string} Layout name (QWERTY, AZERTY, QWERTZ, DVORAK, COLEMAK, UNKNOWN)
 */
export function detectLayoutType(layoutMap) {
  if (!layoutMap) return "QWERTY";

  // Check specific keys to determine layout type
  const keyQ = layoutMap.get("KeyQ");
  const keyW = layoutMap.get("KeyW");
  const keyE = layoutMap.get("KeyE");
  const keyA = layoutMap.get("KeyA");
  const keyS = layoutMap.get("KeyS");
  const keyD = layoutMap.get("KeyD");
  const keyF = layoutMap.get("KeyF");
  const keyY = layoutMap.get("KeyY");
  const keyZ = layoutMap.get("KeyZ");

  // AZERTY (French)
  if (keyA === "q" && keyQ === "a" && keyZ === "w") {
    return "AZERTY";
  }
  // QWERTZ (German)
  else if (keyZ === "y" && keyY === "z") {
    return "QWERTZ";
  }
  // DVORAK
  else if (keyQ === "'" && keyW === "," && keyE === ".") {
    return "DVORAK";
  }
  // Colemak
  else if (keyS === "r" && keyD === "s" && keyF === "t") {
    return "COLEMAK";
  }
  // QWERTY (default)
  else if (keyQ === "q" && keyW === "w") {
    return "QWERTY";
  }
  // Unknown
  else {
    return "UNKNOWN";
  }
}

/**
 * Adds regional information to layout name based on browser locale
 * @param {string} layoutName - The detected layout name
 * @returns {string} Layout name with region if applicable
 */
export function addRegionalInfo(layoutName) {
  const locale = navigator.language || navigator.userLanguage;
  if (locale) {
    const region = locale.split("-")[1]?.toUpperCase();
    if (region && layoutName === "QWERTY") {
      return `QWERTY (${region})`;
    }
  }
  return layoutName;
}

/**
 * Generates fallback QWERTY keyboard layout
 * @returns {Array} Fallback keyboard layout array
 */
export function generateFallbackLayout() {
  return FALLBACK_QWERTY_KEYS.map((row, rowIndex) => {
    return row.map((key, keyIndex) => ({
      code: KEYBOARD_ROWS[rowIndex][keyIndex],
      key,
      display: key,
    }));
  });
}

/**
 * Generates a complete key map with normal and shift variants
 * @param {KeyboardLayoutMap} layoutMap - The keyboard layout map from Keyboard API
 * @returns {Object} Key map object with structure: { code: { normal: 'char', shift: 'CHAR' } }
 */
export function generateKeyMap(layoutMap) {
  if (!layoutMap) {
    return generateFallbackKeyMap();
  }

  const keyMap = {};

  // Process all keyboard rows
  KEYBOARD_ROWS.flat().forEach((code) => {
    const normalKey = layoutMap.get(code);

    if (normalKey) {
      // For letter keys, shift is uppercase
      if (code.startsWith("Key")) {
        keyMap[code] = {
          normal: normalKey.toLowerCase(),
          shift: normalKey.toUpperCase(),
        };
      }
      // For digit and symbol keys, we need to infer shift variants
      else {
        keyMap[code] = {
          normal: normalKey,
          shift: getShiftVariant(code, normalKey),
        };
      }
    }
  });

  return keyMap;
}

/**
 * Gets the shift variant for a key based on standard keyboard layouts
 * @param {string} code - Key code
 * @param {string} normalKey - Normal key character
 * @returns {string} Shift variant character
 */
function getShiftVariant(code, normalKey) {
  // Standard US QWERTY shift mappings

  // Return mapped shift variant or uppercase for unknown
  return SHIFT_MAP[code] || normalKey.toUpperCase();
}

/**
 * Generates fallback key map for QWERTY layout
 * @returns {Object} Fallback key map
 */
function generateFallbackKeyMap() {
  const keyMap = {};

  // Flatten keyboard rows and map with fallback keys
  KEYBOARD_ROWS.forEach((row, rowIndex) => {
    row.forEach((code, keyIndex) => {
      const normalKey = FALLBACK_QWERTY_KEYS[rowIndex][keyIndex];

      keyMap[code] = {
        normal: normalKey.toLowerCase(),
        shift: code.startsWith("Key")
          ? normalKey.toUpperCase()
          : getShiftVariant(code, normalKey),
      };
    });
  });

  return keyMap;
}
