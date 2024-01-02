import { Box } from 'grommet';
import React from 'react';

function Divider() {
  return (
    <Box
      width="100%"
      height="1px"
      border={{
        color: 'text',
        size: '2px',
        style: 'solid',
        side: 'top',
      }}
    />
  );
}

export default Divider;
