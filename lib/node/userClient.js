import { encryptMessageAsymmetric } from '../js/encryption';
import { httpErrorCodes } from '../js/httpErrorCodes';
import { adminId, adminUserSortKey, userSortKey } from './constants';
import { dbClient } from './dbClient';
import { generateId, generateUUID } from './idUtils';
import { response } from './response';
import { tokenClient } from './tokenClient';

export const userClient = {
  async create({ username, email, publicKey, encryptedPrivateKey }) {
    const id = generateUUID();
    const signinChallenge = generateUUID();
    const createdAt = Date.now();

    const adminSortKey = generateId(adminUserSortKey, createdAt);
    const adminUser = {
      id: adminId,
      sortKey: adminSortKey,
      username,
      email,
      userId: id,
    };
    await dbClient.create(adminUser);

    const user = {
      id,
      sortKey: userSortKey,
      username,
      email,
      publicKey,
      encryptedPrivateKey,
      signinChallenge,
      createdAt,
      adminSortKey,
    };
    await dbClient.create(user);

    if (username) {
      const usernameUser = {
        id: username,
        sortKey: userSortKey,
        userId: id,
        adminSortKey,
      };
      await dbClient.create(usernameUser);
    }

    if (email) {
      const emailUser = {
        id: email,
        sortKey: userSortKey,
        userId: id,
        adminSortKey,
      };
      await dbClient.create(emailUser);
    }

    return { id, username, email };
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

  async getByEmail(email) {
    const emailUser = await dbClient.get(email, userSortKey);
    if (emailUser) {
      const { userId } = emailUser;
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

  async skip2FA(userId) {
    const updatedUser = await dbClient.update(userId, userSortKey, {
      twoFactorChecked: true,
    });

    return updatedUser;
  },

  async save2FASecret(username, secret) {
    const user = await userClient.getByUsername(username);
    if (!user) {
      return response(httpErrorCodes.NOT_FOUND, 404);
    }

    const encryptedSecretCode = await encryptMessageAsymmetric(user.publicKey, secret.secret);
    const encryptedSecretUri = await encryptMessageAsymmetric(user.publicKey, secret.uri);
    const encryptedSecretCodeForBackend = await encryptMessageAsymmetric(
      JSON.parse(`"${process.env.BACKEND_PUBLIC_KEY}"`),
      secret.secret
    );

    const updatedUser = await dbClient.update(user.id, userSortKey, {
      ...user,
      twoFactorSecret: {
        secret: encryptedSecretCode,
        uri: encryptedSecretUri,
        secretForBackend: encryptedSecretCodeForBackend,
      },
      twoFactorEnabled: false,
    });

    return updatedUser;
  },

  async enable2FA(userId) {
    const user = await dbClient.get(userId, userSortKey);
    const updatedUser = await dbClient.update(userId, userSortKey, {
      ...user,
      twoFactorEnabled: true,
      twoFactorChecked: true,
    });

    return updatedUser;
  },

  async disable2FA(userId) {
    const updatedUser = await dbClient.update(userId, userSortKey, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
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
    if (user?.username) {
      await dbClient.delete(user.username, userSortKey);
    }
    if (user?.email) {
      await dbClient.delete(user.email, userSortKey);
    }
    if (user.adminSortKey) {
      await dbClient.delete(adminId, user.adminSortKey);
    }

    await dbClient.delete(userId, userSortKey);
  },
};
