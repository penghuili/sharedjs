import { Box, Button, Text } from 'grommet';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';

import AppBar from '../AppBar';
import ContentWrapper from '../ContentWrapper';
import InputField from '../InputField';
import Spacer from '../Spacer';

function Setup2FA({ isLoading, twoFactorAuthEnabled, twoFactorUri, onGenerateSecret, onEnable }) {
  const [code, setCode] = useState('');

  return (
    <>
      <AppBar title="2-Factor Authentication" isLoading={isLoading} hasBack />
      <ContentWrapper>
        {!!twoFactorAuthEnabled && !!twoFactorUri && (
          <Text>2-Factor Authentication is enabled.</Text>
        )}

        {!twoFactorAuthEnabled && !twoFactorUri && (
          <>
            <Text>Setup 2-Factor authentication:</Text>
            <Spacer />
            <Button
              label="Generate your secret"
              onClick={onGenerateSecret}
              primary
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
              value={code}
              onChange={setCode}
            />
            <Spacer />
            <Button
              label="Enable 2-Factor Authentication"
              onClick={() => onEnable(code)}
              primary
              disabled={isLoading || !code}
            />
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Setup2FA;
