import { Anchor } from 'grommet';
import React from 'react';
import ContentWrapper from '../../react-pure/ContentWrapper';
import Spacer from '../../react-pure/Spacer';
import AppBar from '../AppBar';
import DeleteAccountLink from '../DeleteAccountLink';
import RouteLink from '../RouteLink';

function Security({ isLoading, onLogOut, onLogOutFromAllDevices }) {
  return (
    <>
      <AppBar title="Security" hasBack isLoading={isLoading} />
      <ContentWrapper>
        <RouteLink label="2-Factor Authentication" to="/security/2fa" />
        <Spacer />
        <RouteLink label="Change password" to="/security/password" />
        <Spacer />
        <Anchor label="Log out" onClick={onLogOut} />
        <Spacer />
        <Anchor label="Log out from all devices" onClick={onLogOutFromAllDevices} />
        <Spacer />
        <DeleteAccountLink />
      </ContentWrapper>
    </>
  );
}

export default Security;
