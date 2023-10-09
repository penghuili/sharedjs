import { Grommet, Page } from 'grommet';
import React from 'react';

function AppContainer({ children, theme, themeMode }) {
  return (
    <Grommet theme={theme} themeMode={themeMode} style={{ minHeight: '100vh', width: '100%' }}>
      <Page kind="narrow">{children}</Page>
    </Grommet>
  );
}

export default AppContainer;
