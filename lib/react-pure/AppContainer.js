import { Grommet, Page } from 'grommet';
import React from 'react';

function AppContainer({ children, theme, themeMode }) {
  return (
    <Grommet
      theme={theme}
      themeMode={themeMode}
      style={{ minHeight: 'calc(100vh + 1rem)', width: '100%', lineHeight: 'normal' }}
    >
      <Page kind="narrow">{children}</Page>
    </Grommet>
  );
}

export default AppContainer;
