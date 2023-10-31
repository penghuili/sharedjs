import { Box, Tag, Text } from 'grommet';
import { Close } from 'grommet-icons';
import React, { useMemo, useState } from 'react';
import AnimatedBox from '../../react-pure/AnimatedBox';
import Divider from '../../react-pure/Divider';
import Spacer from '../../react-pure/Spacer';
import GroupAdd from '../GroupAdd';
import { useEffectOnce } from '../hooks/useEffectOnce';

function GroupsSelector({
  group37Prefix,
  groupSelectors,
  groupActions,
  selectedGroups,
  groups,
  groupsObj,
  alwaysShow = true,
  onFetchGroups,
  onSelect,
}) {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const selectedGroupsObj = useMemo(() => {
    return (selectedGroups || []).reduce((acc, groupId) => {
      acc[groupId] = groupId;
      return acc;
    }, {});
  }, [selectedGroups]);

  useEffectOnce(() => {
    onFetchGroups({ prefix: group37Prefix });
  });

  function handleRemove(groupToRemove) {
    onSelect(selectedGroups.filter(id => id !== groupToRemove.sortKey));
  }
  function toggleTags() {
    setShowSelector(!showSelector);
  }

  return (
    <>
      <Text weight="bold" onClick={toggleTags}>
        Select tags
      </Text>
      {!!selectedGroups?.length && (
        <Box direction="row" wrap onClick={toggleTags}>
          {(selectedGroups || []).map(
            id =>
              groupsObj[id] && (
                <Text key={id} margin="0 0.5rem 0 0">
                  #{groupsObj[id].title}{' '}
                  <Close
                    onClick={e => {
                      e.stopPropagation();
                      handleRemove(groupsObj[id]);
                    }}
                    size="small"
                  />
                </Text>
              )
          )}
        </Box>
      )}

      <AnimatedBox visible={showSelector || alwaysShow}>
        <Box direction="row" wrap margin="0.5rem 0 0">
          {(groups || []).map(group => {
            const obj = selectedGroupsObj[group.sortKey];
            const color = obj ? 'brand' : undefined;

            return (
              <Tag
                key={group.sortKey}
                value={
                  <Text color={color} size="small">
                    {group.title}
                  </Text>
                }
                onClick={
                  obj
                    ? undefined
                    : () => {
                        onSelect([...selectedGroups, group.sortKey]);
                      }
                }
                onRemove={
                  obj
                    ? () => {
                        handleRemove(group);
                      }
                    : undefined
                }
                size="small"
                margin="0 1rem 0.5rem 0"
              />
            );
          })}
          <Tag
            value={showAddGroup ? 'x' : '+'}
            onClick={() => setShowAddGroup(!showAddGroup)}
            size="small"
            margin="0 1rem 0.5rem 0"
          />
        </Box>
        {showAddGroup && (
          <>
            <Divider />
            <Spacer />
            <GroupAdd
              groupSelectors={groupSelectors}
              groupActions={groupActions}
              group37Prefix={group37Prefix}
              onSucceeded={newGroup => {
                setShowAddGroup(false);
                onSelect([...selectedGroups, newGroup.sortKey]);
              }}
            />
            <Spacer />
            <Divider />
          </>
        )}
      </AnimatedBox>
    </>
  );
}

export default GroupsSelector;
