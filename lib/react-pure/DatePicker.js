import { Box, DateInput, Text } from 'grommet';
import React from 'react';

import { formatDate, formatDateTime } from '../js/date';

function setCurrentTime(date) {
  const day = new Date(date).toISOString().slice(0, 10);
  const time = new Date().toISOString().slice(10);
  return new Date(`${day}${time}`);
}

function DatePicker({ label, value, onChange, showTime }) {
  const dateObj = value ? new Date(value) : new Date();
  const dateString = dateObj.toISOString();


  return (
   <>
    <Text weight="bold">{label}</Text>
    <Box direction="row" align="center">
      <Text>{showTime ? formatDateTime(dateObj) : formatDate(dateObj)}</Text>
      <DateInput
        value={dateString}
        onChange={({ value: newDate }) => {
          onChange(setCurrentTime(newDate));
        }}
      />
    </Box>
  </>
  );
}

export default DatePicker;
