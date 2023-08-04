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
  note37: {
    name: 'Note37',
    color: '#DB4437',
  },
  pay37: 'pay37',
  watcher37: {
    name: 'Watcher37',
    color: '#e8751a',
  },
};

export const appNameToAPIName = {
  [apps.note37.name]: 'note37',
  [apps.link37.name]: 'link37',
  [apps.watcher37.name]: 'pagewatcher',
};

export default apps;
