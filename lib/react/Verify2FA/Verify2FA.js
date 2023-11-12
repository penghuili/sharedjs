import { Button, Text } from 'grommet';
import React, { useState } from 'react';
import ContentWrapper from '../../react-pure/ContentWrapper';
import InputField from '../../react-pure/InputField';
import AppBar from '../AppBar';
import RouteLink from '../RouteLink';
import { useEffectOnce } from '../hooks/useEffectOnce';

function Verify2FA({ errorMessage, isLoading, onClearError, onVerify }) {
  const [code, setCode] = useState('');

  useEffectOnce(() => {
    return onClearError;
  });

  const isDisabled = !code || isLoading;
  function handleSubmit() {
    if (isDisabled) {
      return;
    }

    onVerify(code);
  }

  return (
    <>
      <AppBar title="2-factor Authentication" isLoading={isLoading} hasBack />
      <ContentWrapper>
        <Text>Enter the code from your authenticator app</Text>

        <InputField
          title="MFA Code"
          value={code}
          autoFocus
          onChange={setCode}
          onSubmit={handleSubmit}
        />
        {!!errorMessage && <Text color="status-error">{errorMessage}</Text>}

        <Button
          label={isLoading ? 'Loading...' : 'Verify'}
          onClick={handleSubmit}
          disabled={isDisabled}
          primary
          color="brand"
          margin="1rem 0"
        />

        <RouteLink to="/sign-in" label="Cancel" />
      </ContentWrapper>
    </>
  );
}

export default Verify2FA;
