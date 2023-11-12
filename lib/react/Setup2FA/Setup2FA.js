import { Box, Button, Text } from 'grommet';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import ContentWrapper from '../../react-pure/ContentWrapper';
import Diviver from '../../react-pure/Divider';
import InputField from '../../react-pure/InputField';
import Spacer from '../../react-pure/Spacer';
import AppBar from '../AppBar';

function Setup2FA({
  isLoading,
  twoFactorAuthEnabled,
  twoFactorUri,
  onGenerateSecret,
  onEnable,
  onDisable,
}) {
  const [codeForEnable, setCodeForEnable] = useState('');
  const [codeForDisable, setCodeForDisable] = useState('');

  const isDisableValid = !!codeForDisable && !isLoading;
  function handleDisable() {
    if (!isDisableValid) {
      return;
    }

    onDisable(codeForDisable);
  }

  const isEnableValid = !!codeForEnable && !isLoading;
  function handleEnable() {
    if (!isEnableValid) {
      return;
    }

    onEnable(codeForEnable);
  }

  return (
    <>
      <AppBar title="2-Factor Authentication" isLoading={isLoading} hasBack />
      <ContentWrapper>
        {!!twoFactorAuthEnabled && !!twoFactorUri && (
          <>
            <Text>2-Factor Authentication is enabled.</Text>
            <Spacer />
            <Diviver />
            <Spacer />
            <InputField
              label="Enter the code from your authenticator app:"
              placeholder="Code"
              value={codeForDisable}
              onChange={setCodeForDisable}
              onSubmit={handleDisable}
            />
            <Spacer />
            <Button
              label="Disable 2-Factor Authentication"
              onClick={handleDisable}
              primary
              color="status-critical"
              disabled={!isDisableValid}
            />
          </>
        )}

        {!twoFactorAuthEnabled && !twoFactorUri && (
          <>
            <Text>Setup 2-Factor authentication:</Text>
            <Spacer />
            <Button
              label="Generate your secret"
              onClick={onGenerateSecret}
              primary
              color="brand"
              disabled={isLoading}
            />
          </>
        )}

        {!twoFactorAuthEnabled && !!twoFactorUri && (
          <>
            <Text>Scan the QR code with your authenticator app:</Text>
            <Spacer />
            <Box pad="0.5rem" background="light-1">
              <QRCodeSVG value={twoFactorUri} />
            </Box>
            <Spacer />
            <InputField
              label="Then enter the code from your authenticator app:"
              placeholder="Code"
              value={codeForEnable}
              onChange={setCodeForEnable}
              onSubmit={handleEnable}
            />
            <Spacer />
            <Button
              label="Enable 2-Factor Authentication"
              onClick={handleEnable}
              primary
              color="brand"
              disabled={!isEnableValid}
            />
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Setup2FA;
