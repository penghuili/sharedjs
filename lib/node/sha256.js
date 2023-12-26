import crypto from 'crypto';

export function sha256(message) {
  const sha256Hasher = crypto.createHash('sha256');
  return sha256Hasher.update(message).digest('hex');
}
