import { Anchor, Text } from 'grommet';
import React from 'react';

function CannotResetPassword({ app }) {
  return (
    <>
      <Text>
        {app} uses end-to-end encryption for authentication, so you{' '}
        <Text color="status-warning">can't reset your password</Text>.
      </Text>
      <Text>You can change password after sign in.</Text>
      <Text>
        Check <Anchor label="How encryption works" href="/encryption" target="_blank" /> in {app}.
      </Text>
    </>
  );
}

export default CannotResetPassword;
