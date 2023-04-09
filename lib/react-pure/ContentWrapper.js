import { PageContent } from 'grommet';
import React from 'react';

function ContentWrapper({ children, as = 'main' }) {
  return (
      <PageContent align="start" as={as} pad="0 16px" margin="0 0 3rem" responsive={false}>
        {children}
      </PageContent>
  );
}

export default ContentWrapper;
