import { Box, DateInput, Text } from 'grommet';
import React from 'react';

import { formatDate, formatDateTime } from '../js/date';
import { Close } from 'grommet-icons';

function setCurrentTime(date) {
  const day = new Date(date).toISOString().slice(0, 10);
  const time = new Date().toISOString().slice(10);
  return new Date(`${day}${time}`);
}

function DatePicker({ label, value, onChange, showTime }) {
  const dateObj = value ? new Date(value) : null;
  const dateString = value ? dateObj.toISOString() : '';

  function showDate() {
    if (!value) {
      return 'Choose date ->';
    }

    return showTime ? formatDateTime(dateObj) : formatDate(dateObj);
  }

  return (
    <>
      <Text weight="bold">{label}</Text>
      <Box direction="row" align="center">
        <Text>{showDate()}</Text>
        <DateInput
          value={dateString}
          onChange={({ value: newDate }) => {
            onChange(setCurrentTime(newDate));
          }}
        />
        {!!value && <Close onClick={() => onChange(null)} />}
      </Box>
    </>
  );
}

export default DatePicker;
