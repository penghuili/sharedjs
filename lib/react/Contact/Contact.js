import { Anchor, Text } from 'grommet';
import React from 'react';

import { contactEmail } from '../../js/constants';
import AppBar from '../AppBar';
import ContentWrapper from '../../react-pure/ContentWrapper';

function Contact() {
  return (
    <>
      <AppBar title="Contact" hasBack />
      <ContentWrapper>
        <Text margin="1rem 0 0">
          Contact me for anything:{' '}
          <Anchor label={contactEmail} href={`mailto:${contactEmail}`} target="_blank" />
        </Text>
      </ContentWrapper>
    </>
  );
}

export default Contact;
