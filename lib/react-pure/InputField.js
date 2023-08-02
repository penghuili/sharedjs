import { Text, TextInput } from 'grommet';
import React from 'react';

function InputField({
  label,
  placeholder,
  value,
  disabled,
  autoFocus = false,
  onChange,
  onSubmit,
}) {
  return (
    <>
      <Text weight="bold">{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChange={event => onChange(event.target.value)}
        onKeyDown={event => {
          if (!disabled && onSubmit && event.key === 'Enter') {
            onSubmit();
          }
        }}
        disabled={disabled}
        autoFocus={autoFocus}
      />
    </>
  );
}

export default InputField;
