import { COLORS } from './colors';

// Border Radius - Rounded corners
export const RADIUS = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  round: 999,
};

// Spacing - Consistent margins and paddings
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

// Typography - Font sizes
export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
};

// Font Weights
export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Shadows - Elevation levels
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  primary: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryLarge: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Common Card Styles
export const CARD_STYLES = {
  // Minimal white card (Image 2 style)
  minimal: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },

  // Elevated card with shadow
  elevated: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.sm,
  },

  // Primary accent card (Image 1 style - yellow)
  primary: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOWS.primary,
  },

  // Dark card (Image 1 style - spending card)
  dark: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },

  // Subtle background card
  subtle: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
};

// Common Button Styles
export const BUTTON_STYLES = {
  // Primary black button
  primary: {
    backgroundColor: COLORS.black,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Accent button with primary color
  accent: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.primary,
  },

  // Secondary outlined button
  secondary: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Ghost button (transparent)
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Small pill button
  pill: {
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Active pill button
  pillActive: {
    backgroundColor: COLORS.black,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Common Input Styles
export const INPUT_STYLES = {
  base: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },

  focused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },

  error: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },

  disabled: {
    backgroundColor: COLORS.gray100,
    borderColor: COLORS.gray200,
    color: COLORS.textSecondary,
  },
};

// Icon Sizes
export const ICON_SIZE = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Common Layout Styles
export const LAYOUT = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};

// Typography Styles
export const TYPOGRAPHY = {
  h1: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    lineHeight: FONT_SIZE.xxxl * 1.2,
  },

  h2: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    lineHeight: FONT_SIZE.xxl * 1.2,
  },

  h3: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    lineHeight: FONT_SIZE.xl * 1.3,
  },

  h4: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
    lineHeight: FONT_SIZE.lg * 1.3,
  },

  body: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.text,
    lineHeight: FONT_SIZE.md * 1.5,
  },

  bodyBold: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
    lineHeight: FONT_SIZE.md * 1.5,
  },

  caption: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.sm * 1.4,
  },

  captionBold: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.sm * 1.4,
  },

  tiny: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.textTertiary,
    lineHeight: FONT_SIZE.xs * 1.3,
  },
};

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Common Opacity Values
export const OPACITY = {
  pressed: 0.7,
  disabled: 0.5,
  overlay: 0.5,
  overlayLight: 0.3,
};
