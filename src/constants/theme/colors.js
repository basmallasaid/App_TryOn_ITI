const LightColors = {
  backgroundColor: "#F5F6F7",
  primary: "#40B9FF",
  primaryLight: "#89D4ff",
  primarybrand: "#4FC3FF",

  textPrimary: "#121826",
  textSecondary: "#1E1E24",
  textMuted: "#A1A7B3",
  textDark: "#161B22",

  white: "#FFFFFF",
  borderStrong: "#D5D9DE",
  iconGray: "#6B7280",
  borderDefault: "#E9EBEE",

  error: "#FF8A3D",
  success: "#8ED321",
  disabled: "#A0A6B2",

  divider: "#40B9FF",

  textInverse: "#FFFFFF",
};

const DarkColors = {
  backgroundColor: "#0D1117",
  primary: "#40B9FF",
  primaryLight: "#89D4ff",
  primarybrand: "#4FC3FF",

  textPrimary: "#F1F5F9",
  textSecondary: "#A1A7B3",
  textMuted: "#A1A7B3",
  textDark: "#F1F5F9",

  white: "#1E2630",
  borderStrong: "#2D3748",
  iconGray: "#A1A7B3",
  borderDefault: "#2D3748",

  error: "#FF8A3D",
  success: "#8ED321",
  disabled: "#A0A6B2",

  divider: "#40B9FF",

  textInverse: "#FFFFFF",
};

let currentTheme = "light";
const Colors = { ...LightColors };

export const setTheme = (mode) => {
  currentTheme = mode;
  const palette = mode === "dark" ? DarkColors : LightColors;
  Object.assign(Colors, palette);
};

export const getTheme = () => currentTheme;

export { LightColors, DarkColors };

export default Colors;
