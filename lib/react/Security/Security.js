import { Anchor } from 'grommet';
import React, { useState } from 'react';

import AppBar from '../AppBar';
import Confirm from '../Confirm';
import ContentWrapper from '../ContentWrapper';
import RouteLink from '../RouteLink';
import Spacer from '../Spacer';

function Security({ isLoading, onLogOut, onLogOutFromAllDevices, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

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
        <Anchor
          label="Delete account"
          onClick={() => setShowConfirm(true)}
          color="status-critical"
        />

        <Confirm
          message="Your account will be deleted, and everything you created in Watcher37 and Link37. Are you sure?"
          show={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={onDelete}
        />
      </ContentWrapper>
    </>
  );
}

export default Security;
