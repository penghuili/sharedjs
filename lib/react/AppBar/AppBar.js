import { Header, Image, Spinner, Text } from 'grommet';
import { Home, Previous, User } from 'grommet-icons';
import React from 'react';
import HorizontalCenter from '../../react-pure/HorizontalCenter';
import { logo } from '../initShared';

function AppBar({ title, isLoading, hasBack, isLoggedIn, isExpired, onBack, onCustomBack, onNav }) {
  const showUserIcon = isLoggedIn && !hasBack;

  function handleBack() {
    if (onCustomBack) {
      onCustomBack();
    } else {
      onBack();
    }
  }

  return (
    <Header pad="12px 16px" responsive={false} justify="between">
      <HorizontalCenter>
        {hasBack ? <Previous onClick={handleBack} /> : <Image src={logo} width="32px" />}
        <Text size="large" margin="0 0 0 1rem">
          {title}
        </Text>
        {!!isLoading && <Spinner margin="0 0 0 1rem" />}
      </HorizontalCenter>
      {!isExpired && (
        <HorizontalCenter>
          {showUserIcon && <User onClick={() => onNav('/account')} />}
          {!showUserIcon && hasBack && <Home onClick={() => onNav('/')} />}
        </HorizontalCenter>
      )}
    </Header>
  );
}

export default AppBar;
