import { Text } from 'grommet';
import preval from 'preval.macro';
import React from 'react';

import getUTCTimeNumber from '../js/getUTCTimeNumber';

const buildTime = preval`module.exports = new Date().getTime();`;
const formatted = getUTCTimeNumber(new Date(buildTime));

function AppVersion() {
  return <Text size="xsmall">Version: {formatted}</Text>;
}

export default AppVersion;
