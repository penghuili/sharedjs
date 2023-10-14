import { defaultProps } from 'grommet';

export function getColor(color) {
  return defaultProps.theme.global.colors[color];
}

export function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}
