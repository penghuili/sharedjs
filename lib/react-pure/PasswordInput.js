import { Box, Text, TextInput } from 'grommet';
import { FormView, FormViewHide } from 'grommet-icons';
import React, { useState } from 'react';

import HorizontalCenter from './HorizontalCenter';

function PasswordInput({ label, value, onChange, onSubmit }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Text weight="bold">{label || 'Password'}</Text>
      <HorizontalCenter width="100%">
        <TextInput
          type={show ? 'text' : 'password'}
          placeholder={label || 'Password'}
          value={value}
          onChange={event => onChange(event.target.value)}
          onKeyDown={event => {
            if (onSubmit && event.key === 'Enter') {
              onSubmit();
            }
          }}
        />
        <Box width="0.5rem" />
        {show ? (
          <FormView
            onClick={() => {
              setShow(false);
            }}
            size="large"
          />
        ) : (
          <FormViewHide
            onClick={() => {
              setShow(true);
            }}
            size="large"
          />
        )}
      </HorizontalCenter>
    </>
  );
}

export default PasswordInput;
