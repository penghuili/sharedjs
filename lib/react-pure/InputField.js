import { Text, TextInput } from 'grommet';
import React from 'react';

function InputField({ label, placeholder, value, disabled, onChange }) {
  return (
    <>
      <Text weight="bold">{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
      />
    </>
  );
}

export default InputField;
