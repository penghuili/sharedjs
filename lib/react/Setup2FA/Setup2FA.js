import { Box, Button, Text } from 'grommet';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';

import AppBar from '../AppBar';
import ContentWrapper from '../ContentWrapper';
import InputField from '../InputField';
import Spacer from '../Spacer';
import Diviver from '../Divider';

function Setup2FA({ isLoading, twoFactorAuthEnabled, twoFactorUri, onGenerateSecret, onEnable, onDisable }) {
  const [codeForEnable, setCodeForEnable] = useState('');
  const [codeForDisable, setCodeForDisable] = useState('');


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
            />
            <Spacer />
            <Button
              label="Disable 2-Factor Authentication"
              onClick={() => onDisable(codeForDisable)}
              primary
              disabled={isLoading || !codeForDisable}
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
            />
            <Spacer />
            <Button
              label="Enable 2-Factor Authentication"
              onClick={() => onEnable(codeForEnable)}
              primary
              disabled={isLoading || !codeForEnable}
            />
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Setup2FA;
