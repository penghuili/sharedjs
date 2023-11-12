import { httpErrorCodes } from '../js/httpErrorCodes';
import { response } from './response';

export function handleControllerError(source, error) {
  console.log(source, error);
  if (httpErrorCodes[error.response]) {
    throw error;
  }

  return response(httpErrorCodes.UNKNOWN, 400);
}
