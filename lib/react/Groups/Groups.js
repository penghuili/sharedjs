import { Anchor, Box, Spinner, Text } from 'grommet';
import React, { useState } from 'react';

import AnimatedBox from '../../react-pure/AnimatedBox';
import AnimatedList from '../../react-pure/AnimatedList';
import ContentWrapper from '../../react-pure/ContentWrapper';
import Divider from '../../react-pure/Divider';
import HorizontalCenter from '../../react-pure/HorizontalCenter';
import Spacer from '../../react-pure/Spacer';
import AppBar from '../AppBar';
import GroupAdd from '../GroupAdd';
import { useEffectOnce } from '../hooks/useEffectOnce';
import RouteLink from '../RouteLink';

function Groups({
  group37Prefix,
  groupSelectors,
  groupActions,
  groups,
  isLoading,
  isDeleting,
  onFetch,
  onDelete,
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
        <HorizontalCenter margin="0 0 1rem">
          <Anchor
            label={showAddGroup ? 'Hide' : 'Add tag'}
            onClick={() => setShowAddGroup(!showAddGroup)}
            color="status-ok"
            margin="0 1rem 1rem 0"
          />
          <RouteLink
            to={`/groups/reorder`}
            label="Reorder tags"
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

        <Box direction="row" wrap>
          <AnimatedList
            items={groups || []}
            renderItem={group => (
              <Box key={group.sortKey} margin="0 0 1rem">
                <HorizontalCenter>
                  <Text>{group.title}</Text>
                  {focusedGroup?.sortKey === group.sortKey && isDeleting && (
                    <Spinner size="small" />
                  )}
                </HorizontalCenter>
                <HorizontalCenter>
                  <RouteLink
                    to={`/groups/${group.sortKey}/update`}
                    label="Edit"
                    color="status-ok"
                    size="small"
                    margin="0 1rem 1rem 0"
                  />
                  <Anchor
                    label="Delete"
                    onClick={() => {
                      setFocusedGroup(group);
                      onDelete({ itemId: group.sortKey, goBack: false });
                    }}
                    color="status-error"
                    size="small"
                    margin="0 1rem 1rem 0"
                  />
                </HorizontalCenter>
              </Box>
            )}
          />
        </Box>
      </ContentWrapper>
    </>
  );
}

export default Groups;
