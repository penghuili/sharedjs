import { userSortKey } from './constants';
import dbClient from './dbClient';
import tokenClient from './tokenClient';

const userClient = {
  async create({ username, publicKey, encryptedPrivateKey }) {
    const id = tokenClient.uuid();
    const signinChallenge = tokenClient.uuid();
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

  async refreshSigninChallenge(userId) {
    const user = await dbClient.get(userId, userSortKey);
    const updatedUser = await dbClient.update(userId, userSortKey, {
      ...user,
      signinChallenge: tokenClient.uuid(),
    });

    return updatedUser;
  },

  async updateEncryptedPrivateKey(userId, encryptedPrivateKey) {
    const user = await dbClient.get(userId, userSortKey);
    const updatedUser = await dbClient.update(userId, userSortKey, {
      ...user,
      encryptedPrivateKey,
      signinChallenge: tokenClient.uuid(),
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
