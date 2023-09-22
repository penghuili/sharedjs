import { grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { useSelector } from 'react-redux';

import sharedSelectors from '../react/store/sharedSelectors';

export const darkBackground = '#15202B';
export const lightBackground = '#ffffff';

function createTheme(brandColor) {
  return deepMerge(grommet, {
    global: {
      font: {
        family: 'Roboto',
        size: '18px',
        height: '20px',
      },
      colors: {
        brand: brandColor,
        background: {
          dark: darkBackground,
          light: lightBackground,
        },
      },
    },
    anchor: {
      color: {
        dark: 'brand',
        light: 'brand',
      },
    },
  });
}

export function useIsDarkMode() {
  const themeMode = useSelector(state => sharedSelectors.getThemeMode(state));

  return themeMode === 'dark';
}

export function useBackgroundColor() {
  const isDark = useIsDarkMode();

  return isDark ? darkBackground : lightBackground;
}

export default createTheme;
