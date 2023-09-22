import { format, setDate, setMonth, setYear } from 'date-fns';
import { Box, Button, Calendar, Text } from 'grommet';
import { FormNextLink, FormPreviousLink } from 'grommet-icons';
import React, { useState } from 'react';

import { add0 } from '../js/utils';
import useIsMobile from '../react/hooks/useIsMobile';
import AnimatedBox from './AnimatedBox';

const now = new Date();
const years = Array(now.getFullYear() - 2000 + 1)
  .fill(0)
  .map((_, index) => now.getFullYear() - index);
const months = Array(12)
  .fill(0)
  .map((_, index) => add0(index + 1));

function Years({ visible, onSelect }) {
  return (
    <AnimatedBox visible={visible}>
      <Box direction="row" wrap pad="0 0.25rem">
        {years.map(year => (
          <Button
            key={year}
            label={year}
            onClick={() => {
              onSelect(year);
            }}
            size="small"
            plain
            margin="0 0.5rem 0.5rem 0"
          />
        ))}
      </Box>
    </AnimatedBox>
  );
}

function Months({ visible, onSelect }) {
  return (
    <AnimatedBox visible={visible}>
      <Box direction="row" wrap pad="0 0.25rem">
        {months.map(month => (
          <Button
            key={month}
            label={month}
            onClick={() => {
              onSelect(month);
            }}
            size="small"
            plain
            margin="0 0.25rem 0.25rem 0"
          />
        ))}
      </Box>
    </AnimatedBox>
  );
}

function DateCalendar({ date, bounds, onSelect }) {
  const [showYears, setShowYears] = useState(false);
  const [showMonths, SetShowMonths] = useState(false);
  const updatedDate = date || new Date();

  const isMobile = useIsMobile();

  return (
    <Calendar
      margin="0.25rem"
      daysOfWeek
      firstDayOfWeek={1}
      bounds={bounds}
      date={updatedDate.toISOString()}
      size={isMobile ? 'small' : 'medium'}
      onSelect={newDate => {
        onSelect(new Date(newDate));
      }}
      header={({
        date: currentDate,
        onPreviousMonth,
        onNextMonth,
        previousInBound,
        nextInBound,
      }) => (
        <Box>
          <Box
            direction="row"
            align="center"
            justify="between"
            pad={isMobile ? '0 0.25rem' : '0 1rem'}
          >
            <FormPreviousLink disabled={!previousInBound} onClick={onPreviousMonth} />
            <Text>
              <Text
                size={isMobile ? 'small' : 'medium'}
                weight="bold"
                onClick={() => {
                  setShowYears(!showYears);
                  SetShowMonths(false);
                }}
                color={showYears ? 'brand' : undefined}
              >
                {format(currentDate, 'yyyy')}
              </Text>{' '}
              -{' '}
              <Text
                size={isMobile ? 'small' : 'medium'}
                weight="bold"
                onClick={() => {
                  SetShowMonths(!showMonths);
                  setShowYears(false);
                }}
                color={showMonths ? 'brand' : undefined}
              >
                {format(currentDate, 'MM')}
              </Text>
            </Text>
            <FormNextLink disabled={!nextInBound} onClick={onNextMonth} />
          </Box>

          <Years
            visible={showYears}
            onSelect={year => {
              const newDate = setDate(setYear(new Date(updatedDate), year), 1);
              onSelect(newDate);
              setShowYears(false);
            }}
          />
          <Months
            visible={showMonths}
            onSelect={month => {
              const newDate = setDate(setMonth(new Date(updatedDate), +month - 1), 1);
              onSelect(newDate);
              SetShowMonths(false);
            }}
          />
        </Box>
      )}
    />
  );
}

export default DateCalendar;
