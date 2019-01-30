const common = require('commensal-common');
const User = require('./domain/User');

module.exports = class UserHandler {
  constructor(event) {
    this.event = event;
  }

  async getUser(userId) {
    const user = await this._getUser(userId);
    return user;
  }

  async createUser(userParams) {
    this._sanitizeData(userParams);
    this._formatData(userParams);
    const user = await this._createUser(userParams);
    return user;
  }

  async _getUser(userId) {
    const user = new User(userId);
    await user.load();
    return user;
  }

  async _createUser(userParams) {
    const { id, ...params } = userParams;
    const user = new User(id);
    const response = await user.save(params);
    return response;
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
