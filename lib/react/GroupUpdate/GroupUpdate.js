import { Button, CheckBox } from 'grommet';
import React, { useState } from 'react';

import ContentWrapper from '../../react-pure/ContentWrapper';
import InputField from '../../react-pure/InputField';
import Spacer from '../../react-pure/Spacer';
import AppBar from '../AppBar';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useListener } from '../hooks/useListener';

function GroupUpdate({ groupId, group, isLoading, isUpdating, onFetch, onUpdate }) {
  const [title, setTitle] = useState('');
  useListener(group?.title, value => setTitle(value || ''));
  const [isSecondary, setIsSecondary] = useState(false);
  useListener(group?.isSecondary, value => setIsSecondary(value || false));

  useEffectOnce(() => {
    onFetch({ itemId: groupId });
  });

  return (
    <>
      <AppBar title="Update tag" hasBack isLoading={isLoading || isUpdating} />
      <ContentWrapper>
        <InputField label="Title" placeholder="Title" value={title} onChange={setTitle} />
        <Spacer />
        <CheckBox
          checked={isSecondary}
          label="Secondary tag"
          onChange={event => setIsSecondary(event.target.checked)}
        />

        <Spacer />
        <Button
          label="Update tag"
          onClick={() => {
            onUpdate({ itemId: groupId, title, isSecondary, goBack: true });
          }}
          disabled={!title || isLoading || isUpdating}
        />
      </ContentWrapper>
    </>
  );
}

export default GroupUpdate;
