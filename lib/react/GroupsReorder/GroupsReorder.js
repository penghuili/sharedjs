import React from 'react';

import ContentWrapper from '../../react-pure/ContentWrapper';
import Reorder from '../../react-pure/Reorder';
import AppBar from '../AppBar';
import { useEffectOnce } from '../hooks/useEffectOnce';


function GroupsReorder({ group37Prefix, groups, isLoading, onFetch, onUpdate }) {
  useEffectOnce(() => {
    onFetch({ prefix: group37Prefix });
  });

  return (
    <>
      <AppBar title="Reorder tags" isLoading={isLoading} hasBack />
      <ContentWrapper>
        <Reorder
          items={groups}
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

export default GroupsReorder;
