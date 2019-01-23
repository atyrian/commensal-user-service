const common = require('commensal-common');
const User = require('./domain/User');

module.exports = class UserHandler {
  constructor(event) {
    this.event = event;
  }

  async getUser(userId) {
    try {
      const user = await this._getUser(userId);
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createUser(userParams) {
    try {
      this._sanitizeData(userParams);
      this._formatData(userParams);
      const user = await this._createUser(userParams);
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async _getUser(userId) {
    try {
      const user = new User(userId);
      await user.load();
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  _createUser(userParams) {
    const { id, ...params } = userParams;
    const user = new User(id);
    return new Promise((resolve, reject) => {
      user.save(params)
        .then((res) => {
          resolve(res);
        })
        .catch(err => reject(err));
    });
  }

  _sanitizeData(userParams) {
    if (!userParams.name.match(/^[a-öA-Ö\s]*$/)) {
      throw new common.errors.HttpError('Illegal characters in name', 400);
    }

    for (const value in userParams) {
      userParams[value] = this._stripHTML(userParams[value]);
    }
  }

  _stripHTML(value) {
    return value = value.replace(/<[^>]+>/g, '');
  }

  _formatData(userParams) {
    const names = userParams.name.split(' ');
    userParams.last_name = names.length >= 2 ? names[1] : ' ';
    userParams.name = names[0];

    switch (userParams.gender) {
      case 'male': {
        userParams.gender = 0;
        break;
      }
      case 'female': {
        userParams.gender = 1;
        break;
      }
      default: {
        userParams.gender = 3;
        break;
      }
    }
  }
};
