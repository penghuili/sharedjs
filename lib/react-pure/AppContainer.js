import { Grommet, Page } from 'grommet';
import React from 'react';

import Toast from '../react/Toast';

function AppContainer({ children, theme, themeMode }) {
  return (
    <Grommet theme={theme} full themeMode={themeMode}>
      <Page kind="narrow">
        {children}

        <Toast />
      </Page>
    </Grommet>
  );
}

export default AppContainer;
