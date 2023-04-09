import { Button, PageHeader, Text, TextInput } from 'grommet';
import React, { useState } from 'react';

import CannotResetPassword from '../../react-pure/CannotResetPassword';
import ContentWrapper from '../../react-pure/ContentWrapper';
import PasswordInput from '../../react-pure/PasswordInput';
import Spacer from '../../react-pure/Spacer';
import AppBar from '../AppBar';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { app } from '../initShared';
import OneAccountFor from '../OneAccountFor';
import RouteLink from '../RouteLink';

function SignIn({ errorMessage, isLoading, onClearError, onSignIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffectOnce(() => {
    return onClearError;
  });

  const isDisabled = !username || !password || isLoading;

  function handleSubmit() {
    if (isDisabled) {
      return;
    }

    onSignIn(username, password);
  }

  return (
    <>
      <AppBar title={`${app} sign in`} isLoading={isLoading} hasBack />
      <ContentWrapper>
        <OneAccountFor app={app} />

        <PageHeader title="Sign in" />
        <TextInput
          placeholder="Username"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        <Spacer />
        <PasswordInput placeholder="Password" value={password} onChange={setPassword} />
        {!!errorMessage && <Text color="status-error">{errorMessage}</Text>}

        <Button
          label={isLoading ? 'Loading...' : 'Sign in'}
          onClick={handleSubmit}
          disabled={isDisabled}
          primary
          margin="1rem 0"
        />

        <RouteLink to="/sign-up" label="No account? Sign up" />
        <Spacer />
        <CannotResetPassword app={app} />
      </ContentWrapper>
    </>
  );
}

export default SignIn;
