import { Box, Button, Text } from 'grommet';
import { Checkmark, Close } from 'grommet-icons';
import React, { useState } from 'react';

import { formatDate } from '../js/date';
import { useListener } from '../react/hooks/useListener';
import AnimatedBox from './AnimatedBox';
import DateCalendar from './DateCalendar';
import HorizontalCenter from './HorizontalCenter';
import Spacer from './Spacer';

function DateRange({ label, startDate, endDate, startLimit, endLimit, onSelect }) {
  const [innerStartDate, setInnerStartDate] = useState();
  useListener(startDate, value => setInnerStartDate(value));
  const [innerEndDate, setInnerEndDate] = useState();
  useListener(endDate, value => setInnerEndDate(value));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const showClose =
    !!innerStartDate && !!innerEndDate && !showStartDatePicker && !showEndDatePicker;
  return (
    <Box>
      <Box alignSelf="start">
        {showStartDatePicker || showEndDatePicker || (innerStartDate && innerEndDate) ? (
          <HorizontalCenter>
            <Text margin={showClose ? '0 1rem 0 0' : '0'}>
              <Text
                onClick={() => {
                  setShowStartDatePicker(!showStartDatePicker);
                  setShowEndDatePicker(false);
                }}
                color={showStartDatePicker ? 'brand' : undefined}
              >
                {innerStartDate ? formatDate(innerStartDate) : 'Start date'}
              </Text>{' '}
              ~{' '}
              <Text
                onClick={() => {
                  setShowStartDatePicker(false);
                  setShowEndDatePicker(!showEndDatePicker);
                }}
                color={showEndDatePicker ? 'brand' : undefined}
              >
                {innerEndDate ? formatDate(innerEndDate) : 'End date'}
              </Text>
            </Text>
            {showClose && (
              <Close
                onClick={() => {
                  setInnerStartDate(null);
                  setInnerEndDate(null);
                  onSelect({
                    startDate: null,
                    endDate: null,
                  });
                }}
              />
            )}
          </HorizontalCenter>
        ) : (
          <Text onClick={() => setShowStartDatePicker(true)}>{label || 'Select date range'}</Text>
        )}

        <AnimatedBox visible={showStartDatePicker}>
          <Spacer size="0.5rem" />
          <DateCalendar
            bounds={
              startLimit && innerEndDate
                ? [startLimit.toISOString(), innerEndDate.toISOString()]
                : undefined
            }
            date={innerStartDate}
            onSelect={setInnerStartDate}
          />
        </AnimatedBox>
        <AnimatedBox visible={showEndDatePicker}>
          <Spacer size="0.5rem" />
          <DateCalendar
            bounds={
              endLimit && innerStartDate
                ? [innerStartDate.toISOString(), endLimit.toISOString()]
                : undefined
            }
            date={innerEndDate}
            onSelect={setInnerEndDate}
          />
        </AnimatedBox>
        <AnimatedBox visible={showStartDatePicker || showEndDatePicker}>
          <Box direction="row" justify="between" margin="1rem 0 0">
            <Button
              icon={<Close />}
              onClick={() => {
                setShowStartDatePicker(false);
                setShowEndDatePicker(false);
                setInnerStartDate(null);
                setInnerEndDate(null);
              }}
            />
            <Button
              icon={<Checkmark />}
              onClick={() => {
                onSelect({
                  startDate: innerStartDate,
                  endDate: innerEndDate,
                });
                setShowStartDatePicker(false);
                setShowEndDatePicker(false);
              }}
              primary
              disabled={!innerStartDate || !innerEndDate}
            />
          </Box>
        </AnimatedBox>
      </Box>
    </Box>
  );
}

export default DateRange;
