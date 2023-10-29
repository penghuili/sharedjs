import { Anchor, Box, Heading, Image, Text } from 'grommet';
import React from 'react';
import apps from '../../js/apps';
import Divider from '../../react-pure/Divider';
import Spacer from '../../react-pure/Spacer';

function Logo({ isActive, logo, name, color, link }) {
  return (
    <Box margin="0 1rem 0 0" align="center">
      <Box
        border={{ size: isActive ? '4px' : '2px', color: isActive ? 'status-ok' : 'border' }}
        round="small"
        width={isActive ? '72px' : '52px'}
        margin="0 0 1rem"
      >
        <Image src={logo} size={isActive ? '64px' : '48px'} />
      </Box>
      {isActive ? (
        <Text weight="bold" color="status-ok">
          {name}
        </Text>
      ) : (
        <Anchor label={name} href={link} color={color} target="_blank" />
      )}
    </Box>
  );
}

function OneAccountFor({ app }) {
  return (
    <>
      <Heading level="3" margin="0 0 0.25rem">
        One account for all
      </Heading>
      <Box direction="row" align="end" wrap>
        <Logo
          isActive={app === apps.file37.name}
          logo={`${process.env.REACT_APP_ASSETS_FOR_CODE}/encrypt37-logo-231017.png`}
          name={apps.file37.name}
          color={apps.file37.color}
          link="https://app.encrypt37.com/"
        />

        <Logo
          isActive={app === apps.link37.name}
          logo={`${process.env.REACT_APP_ASSETS_FOR_CODE}/link37-logo-231017.png`}
          name={apps.link37.name}
          color={apps.link37.color}
          link="https://link.encrypt37.com/"
        />

        <Logo
          isActive={app === apps.watcher37.name}
          logo={`${process.env.REACT_APP_ASSETS_FOR_CODE}/watcher37-logo-231017.png`}
          name={apps.watcher37.name}
          color={apps.watcher37.color}
          link="https://watcher.encrypt37.com/"
        />
      </Box>
      <Spacer />
      <Divider />
    </>
  );
}

export default OneAccountFor;
