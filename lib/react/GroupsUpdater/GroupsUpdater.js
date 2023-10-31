import { Box, Tag, Text } from 'grommet';
import { Close } from 'grommet-icons';
import React, { useMemo, useState } from 'react';
import AnimatedBox from '../../react-pure/AnimatedBox';
import Divider from '../../react-pure/Divider';
import Spacer from '../../react-pure/Spacer';
import GroupAdd from '../GroupAdd';
import { useEffectOnce } from '../hooks/useEffectOnce';

function GroupsUpdater({
  item,
  group37Prefix,
  groups,
  groupsObj,
  groupSelectors,
  groupActions,
  getIsAddingGroupItem,
  getIsDeletingGroupItem,
  alwaysShow = true,
  onFetchGroups,
  onAdd,
  onDelete,
}) {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showGroups, setShowGroups] = useState(false);

  const selectedGroupsObj = useMemo(() => {
    return (item?.groups || []).reduce((acc, groupId) => {
      acc[groupId.id] = groupId;
      return acc;
    }, {});
  }, [item]);

  useEffectOnce(() => {
    onFetchGroups({ prefix: group37Prefix });
  });

  function handleRemove(groupToRemove) {
    const isDeletingGroupItem = getIsDeletingGroupItem(groupToRemove.sortKey);
    const obj = selectedGroupsObj[groupToRemove.sortKey];

    if (isDeletingGroupItem) {
      return;
    }
    onDelete({
      id: groupToRemove.sortKey,
      itemId: obj.itemId,
    });
  }

  function renderSelected() {
    if (
      !item?.groups?.length ||
      (item.groups.length === 1 && item.groups[0].id.includes('no_group'))
    ) {
      return <Text>Select tag</Text>;
    }

    return item.groups.map(group => {
      const isDeletingGroupItem = getIsDeletingGroupItem(group.id);
      return (
        !!groupsObj?.[group.id] && (
          <Text
            key={group.id}
            margin="0 0.5rem 0 0"
            color={isDeletingGroupItem ? 'status-disabled' : undefined}
          >
            #{groupsObj[group.id].title}{' '}
            <Close
              onClick={e => {
                e.stopPropagation();
                handleRemove(groupsObj[group.id]);
              }}
              size="small"
            />
          </Text>
        )
      );
    });
  }

  return (
    <>
      <Box direction="row" wrap margin="0 0 0.5rem" onClick={() => setShowGroups(!showGroups)}>
        {renderSelected()}
      </Box>
      <AnimatedBox visible={showGroups || alwaysShow}>
        <Box direction="row" wrap>
          {(groups || []).map(group => {
            const isAddingGroupItem = getIsAddingGroupItem(group.sortKey);
            const isDeletingGroupItem = getIsDeletingGroupItem(group.sortKey);
            const obj = selectedGroupsObj[group.sortKey];

            function getColor() {
              if (isAddingGroupItem || isDeletingGroupItem) {
                return 'status-disabled';
              }
              return obj ? 'brand' : undefined;
            }

            return (
              <Tag
                key={group.sortKey}
                value={
                  <Text color={getColor()} size="small">
                    {group.title}
                  </Text>
                }
                onClick={
                  obj
                    ? undefined
                    : () => {
                        if (isAddingGroupItem) {
                          return;
                        }
                        onAdd({
                          id: group.sortKey,
                          createdAt: item.createdAt,
                          sourceId: item.id,
                          sourceSortKey: item.sortKey,
                        });
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
              onSucceeded={() => {
                setShowAddGroup(false);
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

export default GroupsUpdater;
