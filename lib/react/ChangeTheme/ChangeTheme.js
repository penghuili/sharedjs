import { Box, RadioButton } from 'grommet';
import React from 'react';

import HorizontalCenter from '../../react-pure/HorizontalCenter';

function ChangeTheme({ themeMode, onChangeTheme }) {
  return (
    <HorizontalCenter margin="0 0 1rem">
      <RadioButton
        name="dark"
        checked={themeMode === 'dark'}
        label="Dark mode"
        onChange={() => onChangeTheme('dark')}
      />
      <Box width="1rem" />
      <RadioButton
        name="light"
        checked={themeMode === 'light'}
        label="Light mode"
        onChange={() => onChangeTheme('light')}
      />
    </HorizontalCenter>
  );
}

export default ChangeTheme;
