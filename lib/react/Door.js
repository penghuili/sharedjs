import { Button, Image } from 'grommet';
import { Lock, Unlock } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { useBackgroundColor } from '../react-pure/createTheme';
import sharedSelectors from './store/sharedSelectors';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  z-index: 1000;
`;

const Left = styled.div`
  position: fixed;
  left: ${({ left }) => left};
  top: 0;
  width: 50%;
  height: 100%;
  border-right: 1px solid #ddd;
  background-color: ${({ backgroundColor }) => backgroundColor};

  transition: left 0.5s ease-in-out;
`;

const Right = styled.div`
  position: fixed;
  right: ${({ right }) => right};
  top: 0;
  width: 50%;
  height: 100%;
  border-left: 1px solid #ddd;
  background-color: ${({ backgroundColor }) => backgroundColor};

  transition: right 0.5s ease-in-out;
`;

const LogoWrapper = styled.div`
  position: fixed;
  right: ${({ right }) => right};
  bottom: calc(50% + 50px);
  width: 24px;
  height: 24px;

  transition: all 0.5s ease-in-out;
`;
const Open = styled.div`
  position: fixed;
  right: ${({ right }) => right};
  bottom: calc(50% - 12px);
  width: 24px;
  height: 24px;
  background-color: ${({ backgroundColor }) => backgroundColor};

  transition: all 0.5s ease-in-out;
`;

let timeoutId;
let blurTimeoutId;

function Door() {
  const backgroundColor = useBackgroundColor();
  const isLoggedIn = useSelector(state => sharedSelectors.isLoggedIn(state));

  const [open, setOpen] = useState(true);

  useEffect(() => {
    function hidePage() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      setOpen(false);
    }

    function handleBlur() {
      if (blurTimeoutId) {
        clearTimeout(blurTimeoutId);
        blurTimeoutId = null;
      }

      blurTimeoutId = setTimeout(() => {
        hidePage();
      }, 5 * 60 * 1000);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        handleBlur();
      }
    }

    function handleFocus() {
      if (blurTimeoutId) {
        clearTimeout(blurTimeoutId);
        blurTimeoutId = null;
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', hidePage);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  function setupTimer() {
    const newValue = !open;
    setOpen(newValue);

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (newValue) {
      timeoutId = setTimeout(() => {
        setOpen(false);
      }, 60 * 60 * 1000);
    }
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Wrapper>
      <Left left={open ? '-60%' : '0'} backgroundColor={backgroundColor} />
      <Right right={open ? '-60%' : '0'} backgroundColor={backgroundColor} />
      {!open && (
        <LogoWrapper right={open ? '0' : 'calc(50%)'}>
          <Image src={`${process.env.REACT_APP_ASSETS_FOR_CODE}/logo.png`} width="50px" />
        </LogoWrapper>
      )}
      <Open backgroundColor={backgroundColor} right={open ? '0' : 'calc(50% - 12px)'}>
        <Button icon={open ? <Unlock /> : <Lock />} plain onClick={setupTimer} />
      </Open>
    </Wrapper>
  );
}

export default Door;
