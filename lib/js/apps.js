const apps = {
  auth: 'auth',
  pay37: 'pay37',
  link37: {
    name: 'Link37',
    color: '#D2356E',
  },
  watcher37: {
    name: 'Watcher37',
    color: '#e8751a',
  },
};

export const appNameToAPIName = {
  [apps.link37.name]: 'link37',
  [apps.watcher37.name]: 'pagewatcher',
};

export default apps;
