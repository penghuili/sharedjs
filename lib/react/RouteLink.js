import { Anchor } from 'grommet';
import React from 'react';
import { Link } from 'wouter';

function RouteLink({ to, label, margin = '0', color, size }) {
  return (
    <Link to={to}>
      <Anchor label={label} margin={margin} color={color} size={size} />
    </Link>
  );
}

export default RouteLink;
