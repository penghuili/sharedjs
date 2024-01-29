import { Box, Text } from 'grommet';
import { Close } from 'grommet-icons';
import React, { useState } from 'react';
import { formatDate } from '../js/date';
import { useListener } from '../react/hooks/useListener';
import AnimatedBox from './AnimatedBox';
import DateCalendar from './DateCalendar';
import HorizontalCenter from './HorizontalCenter';
import Spacer from './Spacer';

function DatePicker2({ label, date, onSelect }) {
  const [innerDate, setInnerDate] = useState(date || new Date());
  useListener(date, value => {
    if (value) {
      setInnerDate(value);
    }
  });
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Box>
      <Box alignSelf="start">
        <HorizontalCenter>
          <Text margin="0 1rem 0 0">
            <Text
              onClick={() => {
                setShowPicker(!showPicker);
              }}
            >
              {innerDate ? formatDate(innerDate) : label || 'Select date'}
            </Text>
          </Text>
          {!!innerDate && !showPicker && (
            <Close
              onClick={() => {
                setInnerDate(null);
                onSelect(null);
              }}
            />
          )}
        </HorizontalCenter>

        <AnimatedBox visible={showPicker}>
          <Spacer size="0.5rem" />
          <DateCalendar date={innerDate} onSelect={onSelect} />
        </AnimatedBox>
      </Box>
    </Box>
  );
}

export default DatePicker2;
