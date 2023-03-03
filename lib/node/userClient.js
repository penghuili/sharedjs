import { userSortKey } from './constants';
import dbClient from './dbClient';
import { generateUUID } from './idUtils';
import response from './response';
import httpErrorCodes from '../js/httpErrorCodes';
import tokenClient from './tokenClient';

const userClient = {
  async create({ username, publicKey, encryptedPrivateKey }) {
    const id = generateUUID();
    const signinChallenge = generateUUID();
    const createdAt = Date.now();
    const user = {
      id,
      sortKey: userSortKey,
      username,
      publicKey,
      encryptedPrivateKey,
      signinChallenge,
      createdAt,
    };
    await dbClient.create(user);
    const usernameUser = {
      id: username,
      sortKey: userSortKey,
      userId: id,
    };
    await dbClient.create(usernameUser);

    return { id, username };
  },

  async getByUserId(userId) {
    const user = await dbClient.get(userId, userSortKey);

    return user;
  },

  async getByUsername(username) {
    const usernameUser = await dbClient.get(username, userSortKey);
    if (usernameUser) {
      const { userId } = usernameUser;
      const user = await userClient.getByUserId(userId);

      return user;
    }

    return null;
  },

  async generateTokens(userId) {
    const newAccessToken = tokenClient.generateAccessToken(userId);
    const newRefreshToken = tokenClient.generateRefreshToken(userId);

    await dbClient.update(userId, userSortKey, {
      signinChallenge: generateUUID(),
    });

    return {
      id: userId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    };
  },

  async save2FASecret(username, secret) {
    const user = await userClient.getByUsername(username);
    if (!user) {
      return response(httpErrorCodes.NOT_FOUND, 404);
    }

    const updatedUser = await dbClient.update(user.id, userSortKey, {
      ...user,
      twoFactorSecret: secret,
      twoFactorEnabled: false,
    });

    return updatedUser;
  },

  async enable2FA(userId) {
    const user = await dbClient.get(userId, userSortKey);
    const updatedUser = await dbClient.update(userId, userSortKey, {
      ...user,
      twoFactorEnabled: true,
    });

    return updatedUser;
  },

  async updateEncryptedPrivateKey(userId, encryptedPrivateKey) {
    const user = await dbClient.get(userId, userSortKey);
    const updatedUser = await dbClient.update(userId, userSortKey, {
      ...user,
      encryptedPrivateKey,
      signinChallenge: generateUUID(),
      tokenValidFrom: Date.now(),
    });

    return updatedUser;
  },

  async logoutFromAllDevices(userId) {
    const user = await dbClient.get(userId, userSortKey);
    const updatedUser = await dbClient.update(userId, userSortKey, {
      ...user,
      tokenValidFrom: Date.now(),
    });

    return updatedUser;
  },

  async deleteUser(userId) {
    const user = await userClient.getByUserId(userId);
    await dbClient.delete(userId, userSortKey);
    await dbClient.delete(user.username, userSortKey);
  },
};

export default userClient;
