import { Box, Tag, Text } from 'grommet';
import React, { useMemo, useState } from 'react';

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
  onFetchGroups,
  onSelect,
}) {
  const [showAddGroup, setShowAddGroup] = useState(false);

  const selectedGroupsObj = useMemo(() => {
    return (selectedGroups || []).reduce((acc, groupId) => {
      acc[groupId] = groupId;
      return acc;
    }, {});
  }, [selectedGroups]);

  useEffectOnce(() => {
    onFetchGroups({ prefix: group37Prefix });
  });

  return (
    <>
      <Text weight="bold">Select tags:</Text>
      <Box direction="row" wrap>
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
                      onSelect(selectedGroups.filter(id => id !== group.sortKey));
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
    </>
  );
}

export default GroupsSelector;
