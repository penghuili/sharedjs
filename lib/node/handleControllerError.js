import httpErrorCodes from '../js/httpErrorCodes';
import response from './response';

function handleControllerError(source, error) {
  console.log(source, error);
  if (httpErrorCodes[error.response]) {
    throw error;
  }

  return response(httpErrorCodes.UNKNOWN, 400);
}

export default handleControllerError;
