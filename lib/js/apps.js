const apps = {
  auth: 'auth',
  friend37: {
    name: 'Friend37',
    color: '#e8751a',
  },
  link37: {
    name: 'Link37',
    color: '#D2356E',
  },
  often37: {
    name: 'Often37',
    color: '#e8751a',
  },
  pay37: 'pay37',
  watcher37: {
    name: 'Watcher37',
    color: '#e8751a',
  },
};

export const appNameToAPIName = {
  [apps.often37.name]: 'often37',
  [apps.link37.name]: 'link37',
  [apps.watcher37.name]: 'pagewatcher',
};

export default apps;
