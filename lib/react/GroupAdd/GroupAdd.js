import { Button } from 'grommet';
import React, { useState } from 'react';
import InputField from '../../react-pure/InputField';
import Spacer from '../../react-pure/Spacer';

function GroupAdd({ group37Prefix, isCreating, goBack, onCreate, onSucceeded }) {
  const [title, setTitle] = useState('');

  return (
    <>
      <InputField label="New tag" placeholder="New tag name" value={title} onChange={setTitle} />

      <Spacer />
      <Button
        label="Create tag"
        onClick={() => {
          onCreate({ title, sortKeyPrefix: group37Prefix, goBack, onSucceeded });
        }}
        color="brand"
        disabled={!title || isCreating}
      />
    </>
  );
}

export default GroupAdd;
