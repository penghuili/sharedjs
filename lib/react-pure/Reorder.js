import { Box, Spinner, Text } from 'grommet';
import React, { useState } from 'react';
import styled from 'styled-components';

import { calculateItemPosition2 } from '../js/position';

const EmptyWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-right: 0.5rem;
`;

function Empty({ isLoading, disabled, onClick }) {
  return (
    <EmptyWrapper
      onClick={() => {
        if (disabled) {
          return;
        }
        onClick();
      }}
    >
      {isLoading && <Spinner size="small" />}
      <Box width="100%" height="1px" background={disabled ? 'status-disabled' : 'text'} />
    </EmptyWrapper>
  );
}

function Reorder({ items, onReorder, renderItem }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [preIndex, setPreIndex] = useState(null);
  const [afterIndex, setAfterIndex] = useState(null);

  function handleReorder(indexBefore, indexAfter) {
    if (!selectedItem) {
      return;
    }

    setPreIndex(indexBefore);
    setAfterIndex(indexAfter);

    const newPosition = calculateItemPosition2(items, indexBefore, indexAfter);
    onReorder({
      itemId: selectedItem.sortKey,
      newPosition,
      onSucceeded: () => {
        setSelectedItem(null);
        setSelectedItemIndex(null);
        setPreIndex(null);
        setAfterIndex(null);
      },
    });
  }

  if (!items?.length) {
    return null;
  }

  return (
    <>
      <Text margin="0 0 1rem">1. Select an item; 2. Choose its new position:</Text>
      <Box direction="row" wrap>
        {items.map((item, index) => (
          <Box key={item.sortKey} direction="row" align="end" margin="0 0 0.5rem">
            {index === 0 && (
              <Empty
                isLoading={preIndex === -1 && afterIndex === 0}
                disabled={selectedItemIndex === 0}
                onClick={() => handleReorder(-1, 0)}
              />
            )}
            <Box
              margin="0 0.5rem 0 0"
              pad="0.25rem"
              style={{ minWidth: '5rem' }}
              onClick={() => {
                if (selectedItem?.sortKey === item.sortKey) {
                  setSelectedItem(null);
                  setSelectedItemIndex(null);
                } else {
                  setSelectedItem(item);
                  setSelectedItemIndex(index);
                }
              }}
              border={{
                color: selectedItem?.sortKey === item.sortKey ? 'status-ok' : 'border',
                size: '1px',
              }}
            >
              {renderItem ? renderItem(item) : <Text>{item.title}</Text>}
            </Box>

            <Empty
              isLoading={preIndex === index && afterIndex === index + 1}
              disabled={selectedItemIndex === index + 1 || selectedItemIndex === index}
              onClick={() => handleReorder(index, index + 1)}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}

export default Reorder;
