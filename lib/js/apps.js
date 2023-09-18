const apps = {
  auth: 'auth',
  file37: {
    name: 'File37',
    color: '#e8751a',
  },
  friend37: {
    name: 'Friend37',
    color: '#e8751a',
  },
  group37: 'group37',
  link37: {
    name: 'Link37',
    color: '#D2356E',
  },
  note37: {
    name: 'Note37',
    color: '#DB4437',
  },
  pay37: 'pay37',
  ppic37: {
    name: 'PPic37',
    color: '#ff922b',
  },
  watcher37: {
    name: 'Watcher37',
    color: '#e8751a',
  },
};

export const appNameToAPIName = {
  [apps.file37.name]: 'file37',
  [apps.friend37.name]: 'friend37',
  [apps.link37.name]: 'link37',
  [apps.note37.name]: 'note37',
  [apps.ppic37.name]: 'ppic37',
  [apps.watcher37.name]: 'pagewatcher',
};

export const group37Prefix = {
  file37: 'group37_file37_',
};

export function getNoGroupSortKey(sortKeyPrefix) {
  return `${sortKeyPrefix}no_group`;
}

export default apps;
