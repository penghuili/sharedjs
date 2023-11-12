import { differenceInCalendarDays } from 'date-fns';
import { Box, Button, Text } from 'grommet';
import React from 'react';
import { formatDate } from '../../js/date';

function PaymentStatus({ settings, isTrying, expiresAt, tried, showBuyButton, app, onTry, onNav }) {
  function renderStatus() {
    if (!expiresAt) {
      return null;
    }

    const expiresDate = new Date(expiresAt);
    const formattedExpiresDate = formatDate(expiresDate);
    const today = new Date();
    const formattedToday = formatDate(today);
    const isExpired = formattedExpiresDate < formattedToday;
    const validDays = differenceInCalendarDays(expiresDate, today);
    const willBeExpiredSoon = validDays <= 7;

    if (isExpired) {
      return (
        <Text color="status-critical" margin="0 0.5rem 0 0">
          Your account is expired (Valid until {formattedExpiresDate}).
        </Text>
      );
    }

    if (willBeExpiredSoon) {
      return (
        <Text color="status-warning" margin="0 0.5rem 0 0">
          Your account will be expired after {formattedExpiresDate} ({validDays}{' '}
          {validDays > 1 ? 'days' : 'day'} left).
        </Text>
      );
    }

    return (
      <Text color="status-ok" margin="0 0.5rem 0 0">
        Your account will be expired after {formattedExpiresDate} ({validDays} days left).
      </Text>
    );
  }

  if (!settings) {
    return null;
  }

  if (expiresAt) {
    return (
      <Box margin="0 0 1rem" align="start">
        {renderStatus()}
        {showBuyButton && (
          <Button
            label="Buy ticket"
            onClick={() => onNav('/tickets')}
            primary
            color="brand"
            size="small"
          />
        )}
      </Box>
    );
  }

  if (!tried) {
    return (
      <Box margin="0 0 1rem" align="start">
        <Text color="status-ok">Try 14 days for free</Text>
        <Button
          label="Start"
          onClick={() => onTry(app)}
          primary
          color="brand"
          disabled={isTrying}
          size="small"
        />
      </Box>
    );
  }

  return null;
}

export default PaymentStatus;
