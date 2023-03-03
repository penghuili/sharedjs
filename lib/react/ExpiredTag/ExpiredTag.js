import { Text } from 'grommet';
import React from 'react';
import { useLocation } from 'wouter';

function ExpiredTag({ isAccountValid, expiresAt, onNav }) {
  const [location] = useLocation();

  return (
    !isAccountValid &&
    !!expiresAt && (
      <Text
        onClick={() => {
          if (location !== '/tickets') {
            onNav('/tickets');
          }
        }}
        color="status-critical"
        size="small"
      >
        EXPIRED
      </Text>
    )
  );
}

export default ExpiredTag;
