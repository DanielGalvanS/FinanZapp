import { colors, hexToRgba } from './colors';
import { typography, textStyles } from './typography';
import { spacing, borderRadius, shadows, layout, iconSizes, avatarSizes } from './spacing';

// Main theme object
export const theme = {
  colors,
  typography,
  textStyles,
  spacing,
  borderRadius,
  shadows,
  layout,
  iconSizes,
  avatarSizes,
};

// Export individual modules
export { colors, hexToRgba };
export { typography, textStyles };
export { spacing, borderRadius, shadows, layout, iconSizes, avatarSizes };

// Default export
export default theme;
