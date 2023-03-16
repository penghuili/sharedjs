import { Anchor } from 'grommet';
import React from 'react';
import { Link } from 'wouter';

function RouteLink({ to, label, margin = '0', color }) {
  return (
    <Link to={to}>
      <Anchor label={label} margin={margin} color={color} />
    </Link>
  );
}

export default RouteLink;
