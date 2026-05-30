import colors from "@/constants/colors";

/**
 * Returns the design tokens for the current color scheme.
 *
 * TunePrompt is always dark mode. The app.json forces
 * "userInterfaceStyle": "dark", so this hook always returns dark tokens.
 */
export function useColors() {
  const palette = "dark" in colors
    ? (colors as Record<string, typeof colors.light>).dark
    : colors.light;
  return { ...palette, radius: colors.radius };
}
