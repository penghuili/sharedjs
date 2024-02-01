import { Anchor, Box, Heading, Image, Text } from 'grommet';
import React from 'react';
import { apps } from '../../js/apps';
import Divider from '../../react-pure/Divider';
import Spacer from '../../react-pure/Spacer';

function Logo({ isActive, logo, name, color, link }) {
  return (
    <Box margin="0 1rem 0.5rem 0" align="start">
      <Box
        border={{ size: isActive ? '4px' : '2px', color: isActive ? 'status-ok' : 'border' }}
        round="xsmall"
        width={isActive ? '56px' : '44px'}
        margin="0 0 1rem"
        style={{ overflow: 'hidden' }}
      >
        <Image src={logo} size={isActive ? '52px' : '40px'} />
      </Box>
      {isActive ? (
        <Text weight="bold" color="status-ok" size="small">
          {name}
        </Text>
      ) : (
        <Anchor label={name} href={link} size="small" color={color} target="_blank" />
      )}
    </Box>
  );
}

function OneAccountForAll({ app }) {
  return (
    <>
      <Heading level="3" margin="0 0 0.25rem">
        One account for all
      </Heading>
      <Box direction="row" align="end" wrap>
        <Logo
          isActive={app === apps.Remiind.name}
          logo="https://static.peng37.com/faviconapi/52190fe8-4549-4a16-b25b-3b42954128bc/71a426d2bb5bab9bc94707b32ce633e0/icon-192.png"
          name={apps.Remiind.name}
          color={apps.Remiind.color}
          link="https://remiind.cc/"
        />

        <Logo
          isActive={app === apps.Encrypt37.name}
          logo="https://static.peng37.com/faviconapi/52190fe8-4549-4a16-b25b-3b42954128bc/ad57b4975e3b5add4004281dc78d909b63dd26be286caa3fc815a1c1e57ff8c2/icon-192.png"
          name={apps.Encrypt37.name}
          color={apps.Encrypt37.color}
          link="https://app.encrypt37.com/"
        />

        <Logo
          isActive={app === apps.Watcher37.name}
          logo="https://static.peng37.com/faviconapi/52190fe8-4549-4a16-b25b-3b42954128bc/a6513021c134ddaedcafbef5596381019f1756fed4a499d2f1f4d3553d073e62/icon-192.png"
          name={apps.Watcher37.name}
          color={apps.Watcher37.color}
          link="https://watcher.encrypt37.com/"
        />

        <Logo
          isActive={app === apps.MobilePDF.name}
          logo="https://static.peng37.com/faviconapi/52190fe8-4549-4a16-b25b-3b42954128bc/109c27fa472f61cfb4a4bc6c099a35c9/icon-192.png"
          name={apps.MobilePDF.name}
          color={apps.MobilePDF.color}
          link="https://mobilepdf.net/"
        />

        <Logo
          isActive={app === apps.Link37.name}
          logo="https://static.peng37.com/faviconapi/52190fe8-4549-4a16-b25b-3b42954128bc/6d4ddf3d5c22b6fc1819b4e9312ecae90b470d6556ac6b7243cd3ac658fb664e/icon-192.png"
          name={apps.Link37.name}
          color={apps.Link37.color}
          link="https://link.encrypt37.com/"
        />

        <Logo
          isActive={app === apps.Favicon37.name}
          logo="https://static.peng37.com/faviconapi/52190fe8-4549-4a16-b25b-3b42954128bc/6a73f289f5bad70f4c598230a96c17e8d04b803af6b9e72768129041ac38e691/icon-192.png"
          name={apps.Favicon37.name}
          color={apps.Favicon37.color}
          link="https://peng37.com/favicon37"
        />
      </Box>
      <Spacer />
      <Text size="small">
        All created by <Anchor label="peng37.com" href="https://peng37.com/" target="_blank" />
      </Text>
      <Spacer />
      <Divider />
    </>
  );
}

export default OneAccountForAll;
