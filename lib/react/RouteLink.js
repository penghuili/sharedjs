import { Anchor } from 'grommet';
import React from 'react';
import { Link } from 'wouter';

function RouteLink({ to, label, margin = '0' }) {
  return (
    <Link to={to}>
      <Anchor label={label} margin={margin} />
    </Link>
  );
}

export default RouteLink;
