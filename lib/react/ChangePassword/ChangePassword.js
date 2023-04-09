import { Button } from 'grommet';
import React, { useState } from 'react';

import ContentWrapper from '../../react-pure/ContentWrapper';
import PasswordInput from '../../react-pure/PasswordInput';
import Spacer from '../../react-pure/Spacer';
import AppBar from '../AppBar';

function ChangePassword({ isLoading, onChange }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  return (
    <>
      <AppBar title="Change password" isLoading={isLoading}  hasBack />
      <ContentWrapper>
        <PasswordInput
          placeholder="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <Spacer />
        <PasswordInput placeholder="New password" value={newPassword} onChange={setNewPassword} />
        <Button
          label="Change"
          onClick={() => onChange(currentPassword, newPassword)}
          disabled={!currentPassword || !newPassword || isLoading}
          margin="1rem 0"
        />
      </ContentWrapper>
    </>
  );
}

export default ChangePassword;
