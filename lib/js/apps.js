export const apps = {
  admin: {
    name: 'Admin',
    color: '#FF0000',
  },
  auth: 'auth',
  favicon: {
    name: 'Favicon',
    color: '#CFB53B',
  },
  file37: {
    name: 'Encrypt37',
    color: '#CFB53B',
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
  pdf37: {
    name: 'MobilePDF',
    color: '#ff3847',
  },
  ppic37: {
    name: 'PPic37',
    color: '#ff922b',
  },
  puppeteer: 'puppeteer',
  schedule: 'schedule',
  sharefile: {
    name: 'Encrypt37Share',
    color: '#CFB53B',
  },
  static37: 'static37',
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
  note37: 'group37_note37_',
  pdf37: 'group37_pdf37_',
};

export function getNoGroupSortKey(sortKeyPrefix) {
  return `${sortKeyPrefix}no_group`;
}
