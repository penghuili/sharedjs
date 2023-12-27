const crypto = require('crypto');

export function md5(input) {
  const hash = crypto.createHash('md5');
  if (Buffer.isBuffer(input)) {
      hash.update(input);
  } else if (typeof input === 'string') {
      hash.update(input, 'utf8');
  } else {
      throw new Error('Input must be a string or a buffer');
  }
  return hash.digest('hex');
}
