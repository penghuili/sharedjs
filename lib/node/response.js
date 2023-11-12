import { ApiResponse } from 'claudia-api-builder';

export function response(data, httpCode, headers) {
  return new ApiResponse(data, headers, httpCode);
}
