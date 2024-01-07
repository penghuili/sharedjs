import { Anchor, Button, PageHeader, Text } from 'grommet';
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
import { app, privacyUrl, termsUrl } from '../initShared';

function SignUp({ errorMessage, isLoading, onClearError, onSignUp }) {
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

    onSignUp(username, password);
  }

  return (
    <>
      <AppBar title={`${app} sign up`} isLoading={isLoading} hasBack />
      <ContentWrapper>
        <OneAccountForAll app={app} />

        <PageHeader title="Sign up" />
        <InputField
          label="Username"
          placeholder="Your username"
          value={username}
          onChange={setUsername}
        />
        <Spacer />
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          onSubmit={handleSubmit}
        />

        {!!errorMessage && <Text color="status-error">{errorMessage}</Text>}

        <Text margin="0.5rem 0 0" size="small">
          * By clicking Sign up, you have read and agreed to the{' '}
          <Anchor label="privacy policy" href={privacyUrl} target="_blank" /> and{' '}
          <Anchor label="terms" href={termsUrl} target="_blank" />.
        </Text>

        <Button
          label={isLoading ? 'Loading...' : 'Sign up'}
          onClick={handleSubmit}
          disabled={isDisabled}
          primary
          color="brand"
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
