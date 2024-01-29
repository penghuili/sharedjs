import { format, setDate, setMonth, setYear } from 'date-fns';
import { Box, Button, Calendar, Text, TextInput } from 'grommet';
import { FormNextLink, FormPreviousLink } from 'grommet-icons';
import React, { useState } from 'react';
import { add0 } from '../js/utils';
import useIsMobileSize from '../react/hooks/useIsMobileSize';
import AnimatedBox from './AnimatedBox';

const now = new Date();
const months = Array(12)
  .fill(0)
  .map((_, index) => add0(index + 1));

function Years({ year, visible, onSelect }) {
  const [innerYear, setInnerYear] = useState(year || now.getFullYear());
  return (
    <AnimatedBox visible={visible}>
      <Box margin="0.5rem 0">
        <TextInput
          placeholder="Type year"
          type="number"
          value={innerYear}
          onChange={event => {
            const value = event.target.value;
            setInnerYear(value);
            if (+value > 999 && +value < 9999) {
              onSelect(+value);
            }
          }}
          size="small"
        />
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

function DateCalendar({ date = new Date(), bounds, onSelect }) {
  const [showYears, setShowYears] = useState(false);
  const [showMonths, SetShowMonths] = useState(false);
  const isMobile = useIsMobileSize();

  return (
    <Calendar
      margin="0.25rem"
      daysOfWeek
      firstDayOfWeek={1}
      bounds={bounds}
      date={date?.toISOString()}
      size="small"
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
                size="small"
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
                size="small"
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
            year={date ? date.getFullYear() : undefined}
            onSelect={year => {
              const newDate = setDate(setYear(new Date(date), +year), 1);
              onSelect(newDate);
              setShowYears(false);
            }}
          />
          <Months
            visible={showMonths}
            onSelect={month => {
              const newDate = setDate(setMonth(new Date(date), +month - 1), 1);
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
