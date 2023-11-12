import { Button } from 'grommet';
import React, { useState } from 'react';
import ContentWrapper from '../../react-pure/ContentWrapper';
import PasswordInput from '../../react-pure/PasswordInput';
import Spacer from '../../react-pure/Spacer';
import AppBar from '../AppBar';

function ChangePassword({ isLoading, onChange }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const isDisabled = !currentPassword || !newPassword || isLoading;
  function handleSubmit() {
    if (isDisabled) {
      return;
    }

    onChange(currentPassword, newPassword);
  }

  return (
    <>
      <AppBar title="Change password" isLoading={isLoading} hasBack />
      <ContentWrapper>
        <PasswordInput
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <Spacer />
        <PasswordInput
          label="New password"
          value={newPassword}
          onChange={setNewPassword}
          onSubmit={handleSubmit}
        />
        <Button
          label="Change"
          onClick={handleSubmit}
          primary
          color="brand"
          disabled={isDisabled}
          margin="1rem 0"
        />
      </ContentWrapper>
    </>
  );
}

export default ChangePassword;
