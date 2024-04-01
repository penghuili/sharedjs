import { Button, PageHeader, Text } from 'grommet';
import React, { useState } from 'react';
import CannotResetPassword from '../../react-pure/CannotResetPassword';
import ContentWrapper from '../../react-pure/ContentWrapper';
import InputField from '../../react-pure/InputField';
import PasswordInput from '../../react-pure/PasswordInput';
import Spacer from '../../react-pure/Spacer';
import AppBar from '../AppBar';
import OneAccountForAll from '../OneAccountForAll';
import RouteLink from '../RouteLink';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { app, signupWithEmail } from '../initShared';

function SignIn({ errorMessage, isLoading, onClearError, onSignIn }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffectOnce(() => {
    return onClearError;
  });

  const isDisabled = (!username && !email) || !password || isLoading;

  function handleSubmit() {
    if (isDisabled) {
      return;
    }

    onSignIn(username, email, password);
  }

  return (
    <>
      <AppBar title={`${app} sign in`} isLoading={isLoading} hasBack />
      <ContentWrapper>
        <OneAccountForAll app={app} />

        <PageHeader title="Sign in" />

        {signupWithEmail ? (
          <InputField
            type="email"
            label="Email"
            placeholder="Your email"
            value={email}
            onChange={setEmail}
          />
        ) : (
          <InputField
            label="Username (not email)"
            placeholder="Your username"
            value={username}
            onChange={setUsername}
          />
        )}
        <Spacer />

        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          onSubmit={handleSubmit}
        />
        {!!errorMessage && <Text color="status-error">{errorMessage}</Text>}

        <Button
          label={isLoading ? 'Loading...' : 'Sign in'}
          onClick={handleSubmit}
          disabled={isDisabled}
          primary
          color="brand"
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
