import { Button, Header, Image, Spinner, Text } from 'grommet';
import React from 'react';
import { RiArrowLeftLine, RiHomeSmileLine, RiUserSmileLine } from 'react-icons/ri';
import HorizontalCenter from '../../react-pure/HorizontalCenter';
import { logo } from '../initShared';

function AppBar({
  title,
  right,
  isLoading,
  hasBack,
  isLoggedIn,
  isExpired,
  onBack,
  onCustomBack,
  onNav,
}) {
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
        {hasBack ? (
          <Button icon={<RiArrowLeftLine />} onClick={handleBack} />
        ) : (
          <Image src={logo} width="32px" />
        )}
        <Text size="large" margin="0 0 0 0.5rem">
          {title}
        </Text>
        {!!isLoading && <Spinner margin="0 0 0 1rem" />}
      </HorizontalCenter>
      {!isExpired && (
        <HorizontalCenter>
          {right}
          {showUserIcon && <Button icon={<RiUserSmileLine />} onClick={() => onNav('/account')} />}
          {!showUserIcon && hasBack && (
            <Button icon={<RiHomeSmileLine />} onClick={() => onNav('/')} />
          )}
        </HorizontalCenter>
      )}
    </Header>
  );
}

export default AppBar;
