import { grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { useSelector } from 'react-redux';
import sharedSelectors from '../react/store/sharedSelectors';

export const darkBackground = '#1E1E1E';
export const lightBackground = '#ffffff';

export const fontFamily = `'Noto Sans', 'Noto Sans SC', 'Noto Sans JP', 'Noto Sans KR', 'Noto Sans TC', 'Noto Sans Thai', 'Noto Naskh Arabic', 'Noto Color Emoji', 'Noto Music', sans-serif`;

function createTheme(brandColor) {
  return deepMerge(grommet, {
    global: {
      font: {
        family: fontFamily,
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
      color: 'brand',
    },
    radioButton: {
      color: 'brand',
      check: {
        color: 'brand',
      },
    },
    tab: {
      color: 'text',
      active: { color: 'brand', background: undefined },
      border: {
        color: {
          dark: 'text',
          light: 'text',
        },
        active: {
          color: {
            dark: 'brand',
            light: 'brand',
          },
        },
      },
    },
    tip: {
      content: {
        background: 'background',
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
