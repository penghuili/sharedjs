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
          message="Your account and all watchers and their history will be deleted. Are you sure?"
          show={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={onDelete}
        />
      </ContentWrapper>
    </>
  );
}

export default Security;
