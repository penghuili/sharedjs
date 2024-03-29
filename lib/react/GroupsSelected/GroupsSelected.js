import { Box, Text } from 'grommet';
import React from 'react';

function GroupsSelected({ groupsObj, selectedGroups }) {
  if (!selectedGroups?.length || !groupsObj) {
    return null;
  }

  return (
    <Box direction="row" wrap>
      {(selectedGroups || []).map(group => {
        const groupObj = groupsObj[group.id];
        if (!groupObj) {
          return null;
        }

        return (
          <Text key={group.id} weight="bold" size="small" color="text-xweak" margin="0 1rem 0 0">
            #{groupObj.title}
          </Text>
        );
      })}
    </Box>
  );
}

export default GroupsSelected;
