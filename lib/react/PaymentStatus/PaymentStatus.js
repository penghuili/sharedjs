import { Button, Text } from 'grommet';
import React from 'react';

import { formatDate } from '../../js/date';
import HorizontalCenter from '../../react/HorizontalCenter';
import ExpiredTag from '../ExpiredTag';

function PaymentStatus({
  isLoading,
  isTrying,
  expiresAt,
  tried,
  isAccountValid,
  showBuyButton,
  app,
  onTry,
  onNavigate,
}) {
  if (isLoading) {
    return null;
  }

  if (expiresAt) {
    return (
      <HorizontalCenter margin="0 0 1rem">
        <Text color={isAccountValid ? 'status-ok' : 'status-warning'} margin="0 0.5rem 0 0">
          Expires on: {formatDate(new Date(expiresAt))}
        </Text>
        <ExpiredTag />
        {showBuyButton && (
          <Button
            label="Buy ticket"
            onClick={() => onNavigate('/tickets')}
            size="small"
            margin="0 0 0 1rem"
          />
        )}
      </HorizontalCenter>
    );
  }

  if (!tried) {
    return (
      <HorizontalCenter margin="0 0 1rem">
        <Text color="status-ok">Try 14 days for free</Text>
        <Button
          label="Start"
          onClick={() => onTry(app)}
          disabled={isTrying}
          size="small"
          margin="0 0 0 1rem"
        />
      </HorizontalCenter>
    );
  }

  return null;
}

export default PaymentStatus;
