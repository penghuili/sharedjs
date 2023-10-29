import { Box, Button, Text } from 'grommet';
import React from 'react';
import { useLocation } from 'wouter';

function Enable2FABanner({ isLoading, isLoggedIn, account, onSkip, onNav }) {
  const [location] = useLocation();

  if (
    location === '/security/2fa' ||
    !isLoggedIn ||
    !account?.userId ||
    account.twoFactorEnabled ||
    account.twoFactorChecked
  ) {
    return null;
  }

  return (
    <Box align="center">
      <Box border={{ color: 'status-ok' }} pad="0.5rem" round="small" margin="1rem 0 0">
        <Text>Setup 2-Factor-Authentication to protect your account</Text>
        <Box gap="small" margin="1rem 0 0">
          <Button
            label="Setup"
            onClick={() => onNav('/security/2fa')}
            primary
            disabled={isLoading}
          />
          <Button label="Skip for now" onClick={onSkip} disabled={isLoading} />
        </Box>
      </Box>
    </Box>
  );
}

export default Enable2FABanner;
