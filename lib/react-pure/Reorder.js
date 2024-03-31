import { Box, Spinner, Text } from 'grommet';
import React, { useState } from 'react';
import styled from 'styled-components';
import { calculateItemPosition2 } from '../js/position';
import { getColor } from './color';

const EmptyWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  border: ${({ disabled }) => `2px dashed ${disabled ? getColor('light-4') : getColor('light-6')}`};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
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
      disabled={disabled}
    >
      {isLoading && <Spinner size="small" />}
    </EmptyWrapper>
  );
}

function Reorder({ items, vertical, onReorder, renderItem }) {
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
      <Box direction={vertical ? 'column' : 'row'} wrap={!vertical}>
        {items.map((item, index) => (
          <Box
            key={item.sortKey}
            direction={vertical ? 'column' : 'row'}
            align={vertical ? 'start' : 'end'}
            margin={vertical ? '0' : '0 0 0.5rem'}
            focusIndicator={false}
          >
            {index === 0 && (
              <Empty
                isLoading={preIndex === -1 && afterIndex === 0}
                disabled={selectedItemIndex === 0}
                onClick={() => handleReorder(-1, 0)}
              />
            )}
            <Box
              margin={vertical ? '0.5rem 0' : '0 0.5rem 0 0'}
              pad="0.25rem"
              style={{
                display: 'block',
                minWidth: '5rem',
                textOverflow: 'ellipsis',
                maxWidth: vertical ? 'auto' : '10rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
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
                size: selectedItem?.sortKey === item.sortKey ? 'medium' : '1px',
              }}
              focusIndicator={false}
            >
              {renderItem ? renderItem(item) : item.title}
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
