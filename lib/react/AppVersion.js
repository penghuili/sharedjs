import { Text } from 'grommet';
import preval from 'preval.macro';
import React from 'react';
import { getUTCTimeNumber } from '../js/getUTCTimeNumber';

const buildTime = preval`module.exports = new Date().getTime();`;
const formatted = getUTCTimeNumber(new Date(buildTime)).slice(2, 6);

function AppVersion() {
  return <Text size="xsmall">Version: {formatted}</Text>;
}

export default AppVersion;
