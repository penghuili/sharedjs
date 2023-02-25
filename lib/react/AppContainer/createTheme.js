import { grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';

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
          dark: '#15202B',
          light: '#ffffff',
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
