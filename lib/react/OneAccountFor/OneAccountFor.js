import { Anchor, Avatar, Box, Heading, Text } from 'grommet';
import React from 'react';

import apps from '../../js/apps';
import Divider from '../../react-pure/Divider';
import Spacer from '../../react-pure/Spacer';
import link37logo from './link37.png';
import watcher37logo from './watcher37.png';
import often37logo from './often37.png';
import friend37logo from './friend37.png';

function Logo({ isActive, logo, name, color, link }) {
  return (
    <Box margin="0 1rem 0 0" align="center">
      <Box
        border={{ size: isActive ? '4px' : '2px', color: isActive ? 'status-ok' : 'border' }}
        round="full"
        width={isActive ? '72px' : '52px'}
        margin="0 0 1rem"
      >
        <Avatar src={logo} size={isActive ? '64px' : '48px'} />
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
      <Box direction="row" align="end">
        <Logo
          isActive={app === apps.link37.name}
          logo={link37logo}
          name={apps.link37.name}
          color={apps.link37.color}
          link="https://link37.peng.kiwi/"
        />

        <Logo
          isActive={app === apps.watcher37.name}
          logo={watcher37logo}
          name={apps.watcher37.name}
          color={apps.watcher37.color}
          link="https://watcher37.peng.kiwi/"
        />

        <Logo
          isActive={app === apps.often37.name}
          logo={often37logo}
          name={apps.often37.name}
          color={apps.often37.color}
          link="https://often37.peng.kiwi/"
        />

        <Logo
          isActive={app === apps.friend37.name}
          logo={friend37logo}
          name={apps.friend37.name}
          color={apps.friend37.color}
          link="https://friend37.peng.kiwi/"
        />
      </Box>
      <Spacer />
      <Divider />
    </>
  );
}

export default OneAccountFor;
