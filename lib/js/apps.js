export const apps = {
  Admin: {
    name: 'Admin',
    color: '#FF0000',
    api: 'admin',
  },
  Auth: {
    name: 'Auth',
    color: '#CFB53B',
    api: 'auth',
  },
  Favicon37: {
    name: 'Favicon37',
    color: '#CFB53B',
    api: 'favicon',
  },
  Encrypt37: {
    name: 'Encrypt37',
    color: '#CFB53B',
    api: 'file37',
  },
  Group37: {
    name: 'Group37',
    color: '#CFB53B',
    api: 'group37',
  },
  RememberThat: {
    name: 'RememberThat',
    color: '#FF914D',
    api: 'lifereminder',
  },
  Link37: {
    name: 'Link37',
    color: '#D2356E',
    api: 'link37',
  },
  Note37: {
    name: 'Note37',
    color: '#CFB53B',
    api: 'note37',
  },
  Pay37: {
    name: 'Pay37',
    color: '#CFB53B',
    api: 'pay37',
  },
  MobilePDF: {
    name: 'MobilePDF',
    color: '#ff3847',
    api: 'pdf37',
  },
  Puppeteer: {
    name: 'Puppeteer',
    color: '#CFB53B',
    api: 'puppeteer',
  },
  Schedule: {
    name: 'Schedule',
    color: '#CFB53B',
    api: 'schedule',
  },
  Encrypt37Share: {
    name: 'Encrypt37Share',
    color: '#CFB53B',
    api: 'sharefile',
  },
  Static37: {
    name: 'Static37',
    color: '#CFB53B',
    api: 'static37',
  },
  Watcher37: {
    name: 'Watcher37',
    color: '#e8751a',
    api: 'pagewatcher',
  },
};

export const group37Prefix = {
  file37: 'group37_file37_',
  note37: 'group37_note37_',
  pdf37: 'group37_pdf37_',
};

export function getNoGroupSortKey(sortKeyPrefix) {
  return `${sortKeyPrefix}no_group`;
}
