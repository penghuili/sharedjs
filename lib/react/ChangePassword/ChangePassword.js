import { Button } from 'grommet';
import React, { useState } from 'react';

import AppBar from '../AppBar';
import ContentWrapper from '../ContentWrapper';
import PasswordInput from '../PasswordInput';
import Spacer from '../Spacer';

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
