import { Anchor, Text } from 'grommet';
import React from 'react';
import { encryptionUrl } from '../react/initShared';

function CannotResetPassword({ app }) {
  return (
    <>
      <Text>
        {app} uses end-to-end encryption for authentication, so you{' '}
        <Text color="status-critical">can't reset your password</Text>.
      </Text>
      <Text>You can change password after sign in.</Text>
      <Text>
        Check <Anchor label="How encryption works" href={encryptionUrl} target="_blank" /> in {app}.
      </Text>
    </>
  );
}

export default CannotResetPassword;
