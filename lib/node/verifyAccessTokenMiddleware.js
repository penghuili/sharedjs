import { httpErrorCodes } from '../js/httpErrorCodes';
import { hasValidIssuedAt } from './hasValidIssuedAt';
import { parseRequest } from './parseRequest';
import { response } from './response';
import { tokenClient } from './tokenClient';

export async function verifyAccessTokenMiddleware(request) {
  const { headers } = parseRequest(request);

  const { authorization, Authorization } = headers || {};

  const authorizationHeader = Authorization || authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw response(httpErrorCodes.UNAUTHORIZED, 401);
  }

  const token = authorizationHeader.split(' ')[1];

  const decoded = tokenClient.verifyAccessToken(token);
  if (!decoded) {
    throw response(httpErrorCodes.UNAUTHORIZED, 401);
  }

  await hasValidIssuedAt(decoded);

  return decoded;
}
