import { Box } from 'grommet';
import React from 'react';

function HorizontalCenter({ children, ...rest }) {
  return (
    <Box direction="row" align="center" {...rest}>
      {children}
    </Box>
  );
}

export default HorizontalCenter;
