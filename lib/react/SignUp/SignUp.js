import { Anchor, Button, PageHeader, Text, TextInput } from 'grommet';
import React, { useState } from 'react';

import AppBar from '../AppBar';
import CannotResetPassword from '../CannotResetPassword';
import ContentWrapper from '../ContentWrapper';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { app } from '../initShared';
import OneAccountFor from '../OneAccountFor';
import PasswordInput from '../PasswordInput';
import RouteLink from '../RouteLink';
import Spacer from '../Spacer';

function SignUp({ errorMessage, isLoading, onClearError, onSignUp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffectOnce(() => {
    return onClearError;
  });

  return (
    <>
      <AppBar title={`${app} sign up`} isLoading={isLoading} hasBack />
      <ContentWrapper>
        <OneAccountFor app={app} />

        <PageHeader title="Sign up" />
        <TextInput
          placeholder="Username"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        <Spacer />
        <PasswordInput placeholder="Password" value={password} onChange={setPassword} />

        {!!errorMessage && <Text color="status-error">{errorMessage}</Text>}

        <Text margin="0.5rem 0 0" size="small">
          * By clicking Sign up, you have read and agreed to the{' '}
          <Anchor label="Privacy" href="/privacy" target="_blank" /> and{' '}
          <Anchor label="Terms" href="/terms" target="_blank" />.
        </Text>

        <Button
          label={isLoading ? 'Loading...' : 'Sign up'}
          onClick={() => onSignUp(username, password)}
          disabled={!username || !password || isLoading}
          primary
          margin="1rem 0"
        />

        <RouteLink to="/sign-in" label="Already have account? Sign in" />
        <Spacer />
        <CannotResetPassword app={app} />
      </ContentWrapper>
    </>
  );
}

export default SignUp;
