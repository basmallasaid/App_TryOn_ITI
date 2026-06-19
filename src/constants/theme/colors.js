const LightColors = {
  backgroundColor: "#F5F6F7",
  surfaceCards: "#FFFFFF",
  primary: "#40B9FF",
  primaryLight: "#89D4FF",
  primarybrand: "#40B9FF",

  secondary: "#8ED321",
  secondaryLight: "#B7F15A",

  accent: "#FF6B8A",
  accentLight: "#FFACC1",
  accentOrange: "#FF8A3D",

  textPrimary: "#121826",
  textSecondary: "#1E1E24",
  textMuted: "#A1A7B3",
  textDark: "#161B22",

  white: "#FFFFFF",
  surfaceElevated: "#F2F3FF",
  borderStrong: "#D5D9DE",
  iconGray: "#6B7280",
  borderDefault: "#E9EBEE",

  error: "#FF8A3D",
  success: "#8ED321",
  disabled: "#A0A6B2",

  divider: "#E9EBEE",
  tabInactive: "#E9EBEE",

  textInverse: "#FFFFFF",

  genderColorMale:"#E5F2FF",
  genderColorFemale:"#FDEDF5",
};

const DarkColors = {
  backgroundColor: "#0D1117",
  surfaceCards: "#161B22",
  primary: "#4FC3FF",
  primaryLight: "#1E3A56",
  primarybrand: "#4FC3FF",

  secondary: "#A6E22E",
  secondaryLight: "#274E13",

  accent: "#FF7D9A",
  accentLight: "#3D1F2A",
  accentOrange: "#FFA35C",

  textPrimary: "#F1F5F9",
  textSecondary: "#A1A7B3",
  textMuted: "#A1A7B3",
  textDark: "#F1F5F9",

  white: "#161B22",
  surfaceElevated: "#1E2630",
  borderStrong: "#2A313C",
  iconGray: "#A1A7B3",
  borderDefault: "#2A313C",

  error: "#FFA35C",
  success: "#A6E22E",
  disabled: "#A0A6B2",

  divider: "#2A313C",
  tabInactive: "#161B22",

  textInverse: "#FFFFFF",

  genderColorMale:"#E5F2FF",
  genderColorFemale:"#FDEDF5",
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
