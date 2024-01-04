import { endOfDay, startOfDay } from 'date-fns';
import { Box, Button, Tag, Text } from 'grommet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { getUTCTimeNumber } from '../../js/getUTCTimeNumber';
import AnimatedBox from '../../react-pure/AnimatedBox';
import DateRange from '../../react-pure/DateRange';
import Divider from '../../react-pure/Divider';
import Spacer from '../../react-pure/Spacer';
import { getColor } from '../../react-pure/color';
import useIsMobileSize from '../hooks/useIsMobileSize';

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

const Wrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  visibility: hidden;
  border-bottom: 1px solid ${getColor('dark-4')};
`;
const InnerWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
`;

function GroupsWrapper({ children }) {
  const isMobile = useIsMobileSize();
  const ref = useRef();
  const innerRef = useRef();

  useEffect(() => {
    const id = setTimeout(() => {
      if (ref.current.offsetWidth < innerRef.current.offsetWidth) {
        ref.current.style.height = isMobile ? '80px' : '88px';
        innerRef.current.style.width = `${innerRef.current.offsetWidth / 2 + 56}px`;
        innerRef.current.style.display = 'flex';
        innerRef.current.style.flexWrap = 'wrap';

        if (innerRef.current.offsetHeight > ref.current.offsetHeight) {
          ref.current.style.height = `${innerRef.current.offsetHeight + (isMobile ? 8 : 16)}px`;
        }
      }
      ref.current.style.visibility = 'visible';
    }, 500);

    return () => {
      clearTimeout(id);
    };
  }, [isMobile]);

  return (
    <Wrapper ref={ref}>
      <InnerWrapper ref={innerRef}>{children}</InnerWrapper>
    </Wrapper>
  );
}

function GroupFilter({
  groups,
  groupsObj,
  primaryGroups,
  secondaryGroups,
  noGroupItem,
  selectedGroupId,
  startTime,
  endTime,
  isExpired,
  onSelectGroup,
  onSelectDateRange,
  onNav,
}) {
  const [showSecondary, setShowSecondary] = useState(false);
  const hasSelectedSecondary = useMemo(() => {
    return !!secondaryGroups.find(group => group.sortKey === selectedGroupId);
  }, [secondaryGroups, selectedGroupId]);

  function renderSelected() {
    if (!selectedGroupId || selectedGroupId.includes('no_group')) {
      return null;
    }

    const group = groupsObj[selectedGroupId];
    if (!group) {
      return null;
    }

    return (
      <Button
        plain
        label={`#${group.title}`}
        color="brand"
        onClick={() => {
          onSelectGroup(null);
        }}
        size="small"
        margin="0 1rem 0.5rem 0"
      />
    );
  }

  return (
    <>
      {!!primaryGroups?.length && (
        <GroupsWrapper>
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
        </GroupsWrapper>
      )}

      <Box direction="row" wrap pad="0.75rem 0 0">
        {renderSelected()}

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
            label={showSecondary ? 'Hide ' : 'Secondary'}
            onClick={() => {
              setShowSecondary(!showSecondary);
            }}
            size="small"
            margin="0 1rem 0.5rem 0"
          />
        )}

        {!isExpired && !!groups?.length && (
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

      {!!onSelectDateRange && (
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
      )}

      <Spacer />
      <Divider />
      <Spacer />
    </>
  );
}

export default GroupFilter;
