import { Anchor, Box, Spinner, Text } from 'grommet';
import { Edit, Trash } from 'grommet-icons';
import React, { useState } from 'react';

import AnimatedBox from '../../react-pure/AnimatedBox';
import ContentWrapper from '../../react-pure/ContentWrapper';
import Divider from '../../react-pure/Divider';
import HorizontalCenter from '../../react-pure/HorizontalCenter';
import Reorder from '../../react-pure/Reorder';
import Spacer from '../../react-pure/Spacer';
import AppBar from '../AppBar';
import GroupAdd from '../GroupAdd';
import { useEffectOnce } from '../hooks/useEffectOnce';

function Groups({
  group37Prefix,
  groupSelectors,
  groupActions,
  groups,
  isLoading,
  isDeleting,
  onFetch,
  onUpdate,
  onDelete,
  onNav,
}) {
  const [focusedGroup, setFocusedGroup] = useState(null);
  const [showAddGroup, setShowAddGroup] = useState(false);

  useEffectOnce(() => {
    onFetch({ prefix: group37Prefix });
  });

  return (
    <>
      <AppBar title="Tags" hasBack isLoading={isLoading || isDeleting} />
      <ContentWrapper>
        <HorizontalCenter>
          <Anchor
            label={showAddGroup ? 'Hide' : 'Add tag'}
            onClick={() => setShowAddGroup(!showAddGroup)}
            color="status-ok"
            margin="0 1rem 1rem 0"
          />
        </HorizontalCenter>
        <Divider />
        <Spacer />

        <AnimatedBox visible={showAddGroup}>
          <GroupAdd
            group37Prefix={group37Prefix}
            groupSelectors={groupSelectors}
            groupActions={groupActions}
            onSucceeded={() => {
              setShowAddGroup(false);
            }}
          />
          <Spacer />
          <Divider />
          <Spacer />
        </AnimatedBox>

        <Reorder
          items={groups}
          renderItem={group => (
            <Box key={group.sortKey} border pad="0.25rem">
              <HorizontalCenter>
                <Text>{group.title}</Text>
                {focusedGroup?.sortKey === group.sortKey && isDeleting && <Spinner size="small" />}
              </HorizontalCenter>
              <Box direction="row" justify="between" margin="0.5rem 0 0">
                <Edit
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    onNav(`/groups/${group.sortKey}/update`);
                  }}
                />
                <Trash
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusedGroup(group);
                    onDelete({ itemId: group.sortKey, goBack: false });
                  }}
                />
              </Box>
            </Box>
          )}
          onReorder={({ itemId, newPosition, onSucceeded }) => {
            onUpdate({
              itemId,
              position: newPosition,
              goBack: false,
              reorder: true,
              onSucceeded,
            });
          }}
        />
      </ContentWrapper>
    </>
  );
}

export default Groups;
