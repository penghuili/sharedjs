import { Anchor, Spinner } from 'grommet';
import React, { useState } from 'react';

import Confirm from '../../react-pure/Confirm';
import ContentWrapper from '../../react-pure/ContentWrapper';
import Spacer from '../../react-pure/Spacer';
import AppBar from '../AppBar';
import RouteLink from '../RouteLink';
import HorizontalCenter from '../../react-pure/HorizontalCenter';

function Security({ isLoading, isLoadingAccount, onLogOut, onLogOutFromAllDevices, onDelete }) {
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
        <HorizontalCenter>
          <Anchor
            label="Delete account"
            onClick={() => setShowConfirm(true)}
            color="status-critical"
            disabled={isLoadingAccount}
          />
          {isLoadingAccount && <Spinner margin="0 0 0 1rem" size="small" />}
        </HorizontalCenter>

        <Confirm
          message="All your data (Encrypt37, Link37, Watcher37) will be deleted, Are you sure?"
          show={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={onDelete}
        />
      </ContentWrapper>
    </>
  );
}

export default Security;
