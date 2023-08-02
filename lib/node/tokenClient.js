import jsonwebtoken from 'jsonwebtoken';

import httpErrorCodes from '../js/httpErrorCodes';
import response from './response';

const tokenClient = {
  generateAccessToken(userId) {
    return jsonwebtoken.sign(
      { issuer: 'peng37.com', user: userId },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      }
    );
  },
  verifyAccessToken(accessToken) {
    try {
      const decoded = jsonwebtoken.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
      return decoded;
    } catch (error) {
      return null;
    }
  },
  generateRefreshToken(userId) {
    return jsonwebtoken.sign(
      { issuer: 'peng37.com', user: userId },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      }
    );
  },
  verifyRefreshToken(refreshToken) {
    try {
      const decoded = jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
      return decoded;
    } catch (error) {
      throw response(httpErrorCodes.UNAUTHORIZED, 401);
    }
  },
  generateTempToken(userId) {
    return jsonwebtoken.sign(
      { issuer: 'peng37.com', user: userId },
      process.env.JWT_TEMP_TOKEN_SECRET,
      {
        expiresIn: +process.env.JWT_TEMP_TOKEN_EXPIRES_IN,
      }
    );
  },
  verifyTempToken(tempToken) {
    try {
      const decoded = jsonwebtoken.verify(
        tempToken,
        process.env.JWT_TEMP_TOKEN_SECRET
      );
      return decoded;
    } catch (error) {
      throw response(httpErrorCodes.UNAUTHORIZED, 401);
    }
  },
};

export default tokenClient;
