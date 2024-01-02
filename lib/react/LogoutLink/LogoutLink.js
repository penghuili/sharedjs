import { Anchor } from 'grommet';
import React from 'react';

function ChangeTheme({ onLogOut }) {
  return <Anchor label="Log out" onClick={onLogOut} />;
}

export default ChangeTheme;
