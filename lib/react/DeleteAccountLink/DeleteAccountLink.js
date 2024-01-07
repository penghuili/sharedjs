import { Anchor, Spinner } from 'grommet';
import React, { useState } from 'react';
import Confirm from '../../react-pure/Confirm';
import HorizontalCenter from '../../react-pure/HorizontalCenter';

function DeleteAccountLink({ isDeletingAccount, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <HorizontalCenter>
        <Anchor
          label="Delete account"
          onClick={() => setShowConfirm(true)}
          color="status-critical"
          disabled={isDeletingAccount}
        />
        {isDeletingAccount && <Spinner margin="0 0 0 1rem" size="small" />}
      </HorizontalCenter>

      <Confirm
        message="All your data (Encrypt37, Link37, Watcher37) will be deleted, Are you sure?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={onDelete}
      />
    </>
  );
}

export default DeleteAccountLink;
