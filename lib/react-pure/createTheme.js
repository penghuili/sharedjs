import { grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';

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

export default createTheme;
