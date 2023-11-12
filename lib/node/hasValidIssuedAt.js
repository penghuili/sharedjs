import { httpErrorCodes } from '../js/httpErrorCodes';
import { response } from './response';
import { userClient } from './userClient';

export async function hasValidIssuedAt(decoded) {
  const issuedAt = decoded.iat * 1000;
  const user = await userClient.getByUserId(decoded.user);
  if (!user || (user?.tokenValidFrom && issuedAt < user?.tokenValidFrom)) {
    throw response(httpErrorCodes.UNAUTHORIZED, 401);
  }
}
