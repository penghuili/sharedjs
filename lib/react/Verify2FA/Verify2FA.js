import { Button, Text } from 'grommet';
import React, { useState } from 'react';

import AppBar from '../AppBar';
import ContentWrapper from '../ContentWrapper';
import { useEffectOnce } from '../hooks/useEffectOnce';
import InputField from '../InputField';
import RouteLink from '../RouteLink';

function Verify2FA({ errorMessage, isLoading, onClearError, onVerify }) {
  const [code, setCode] = useState('');

  useEffectOnce(() => {
    return onClearError;
  });

  const isDisabled = !code || isLoading;

  return (
    <>
      <AppBar title="Multi-factor Authentication" isLoading={isLoading} hasBack />
      <ContentWrapper>
        <Text>Enter the code from your authenticator app</Text>

        <InputField title="MFA Code" value={code} onChange={setCode} />
        {!!errorMessage && <Text color="status-error">{errorMessage}</Text>}

        <Button
          label={isLoading ? 'Loading...' : 'Verify'}
          onClick={() => onVerify(code)}
          disabled={isDisabled}
          primary
          margin="1rem 0"
        />

        <RouteLink to="/sign-in" label="Cancel" />
      </ContentWrapper>
    </>
  );
}

export default Verify2FA;
