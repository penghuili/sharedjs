import { Text, TextArea } from 'grommet';
import React from 'react';

function AreaField({ label, placeholder, value, disabled, onChange }) {
  return (
    <>
      <Text weight="bold">{label}</Text>
      <TextArea
        placeholder={placeholder}
        value={value}
        onChange={event => onChange(event.target.value)}
        resize="vertical"
        disabled={disabled}
      />
    </>
  );
}

export default AreaField;
