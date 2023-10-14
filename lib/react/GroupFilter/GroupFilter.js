import { endOfDay, startOfDay } from 'date-fns';
import { Box, Button, Tag, Text } from 'grommet';
import React, { useMemo, useState } from 'react';
import getUTCTimeNumber from '../../js/getUTCTimeNumber';
import AnimatedBox from '../../react-pure/AnimatedBox';
import DateRange from '../../react-pure/DateRange';
import Divider from '../../react-pure/Divider';
import Spacer from '../../react-pure/Spacer';

export function parseStartTime(startTime) {
  return startTime ? getUTCTimeNumber(startOfDay(new Date(startTime))) : null;
}
export function parseEndTime(endTime) {
  return endTime ? getUTCTimeNumber(endOfDay(new Date(endTime))) : null;
}

function GroupItem({ group, selectedGroupId, onSelect }) {
  const isSelected = group.sortKey === selectedGroupId;
  return (
    <Tag
      key={group.sortKey}
      value={
        <Text color={isSelected ? 'brand' : undefined} size="small">
          {group.title}
        </Text>
      }
      onClick={() => {
        if (isSelected) {
          onSelect(null);
        } else {
          onSelect(group);
        }
      }}
      size="small"
      margin="0 1rem 0.5rem 0"
    />
  );
}

function GroupFilter({
  groups,
  primaryGroups,
  secondaryGroups,
  noGroupItem,
  selectedGroupId,
  startTime,
  endTime,
  onSelectGroup,
  onSelectDateRange,
  onNav,
}) {
  const [showSecondary, setShowSecondary] = useState(false);
  const hasSelectedSecondary = useMemo(() => {
    return !!secondaryGroups.find(group => group.sortKey === selectedGroupId);
  }, [secondaryGroups, selectedGroupId]);

  return (
    <>
      <AnimatedBox visible={!!groups?.length}>
        <Box direction="row" wrap>
          {primaryGroups.map(group => {
            return (
              <GroupItem
                key={group.sortKey}
                group={group}
                selectedGroupId={selectedGroupId}
                onSelect={onSelectGroup}
              />
            );
          })}
          {!!noGroupItem && (
            <Button
              plain
              label={noGroupItem.title}
              color={selectedGroupId === noGroupItem.sortKey ? 'brand' : undefined}
              onClick={() => {
                if (selectedGroupId === noGroupItem.sortKey) {
                  onSelectGroup(null);
                } else {
                  onSelectGroup(noGroupItem);
                }
              }}
              size="small"
              margin="0 1rem 0.5rem 0"
            />
          )}

          {!hasSelectedSecondary && !!secondaryGroups.length && (
            <Button
              plain
              label={showSecondary ? 'Show less' : 'Show all'}
              onClick={() => {
                setShowSecondary(!showSecondary);
              }}
              size="small"
              margin="0 1rem 0.5rem 0"
            />
          )}

          {!!groups?.length && (
            <Button
              plain
              label="Manage"
              onClick={() => {
                onNav(`/groups`);
              }}
              size="small"
              margin="0 1rem 0.5rem 0"
            />
          )}
        </Box>
      </AnimatedBox>

      <AnimatedBox visible={!!groups?.length && (showSecondary || hasSelectedSecondary)}>
        <Box direction="row" wrap>
          {secondaryGroups.map(group => {
            return (
              <GroupItem
                key={group.sortKey}
                group={group}
                selectedGroupId={selectedGroupId}
                onSelect={onSelectGroup}
              />
            );
          })}
        </Box>
      </AnimatedBox>

      <AnimatedBox visible={!!groups?.length}>
        <Spacer />
        <DateRange
          label="Filter by date"
          startDate={startTime ? new Date(startTime) : null}
          endDate={endTime ? new Date(endTime) : null}
          startLimit={new Date('2023-01-01')}
          endLimit={new Date()}
          onSelect={({ startDate, endDate }) => {
            onSelectDateRange({ startDate, endDate });
          }}
        />
      </AnimatedBox>

      <Spacer />
      <Divider />
      <Spacer />
    </>
  );
}

export default GroupFilter;
