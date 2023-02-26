import { Anchor, Text } from 'grommet';
import React from 'react';

import AppBar from '../AppBar';
import ContentWrapper from '../ContentWrapper';

function Contact() {
  return (
    <>
      <AppBar title="Contact" hasBack />
      <ContentWrapper>
        <Text margin="1rem 0 0">
          Contact me for anything:{' '}
          <Anchor label="peng@duck.com" href="mailto:peng@duck.com" target="_blank" />
        </Text>
      </ContentWrapper>
    </>
  );
}

export default Contact;
