const common = require('commensal-common');
const UserHandler = require('../UserHandler');
const userResponseModelFactory = require('../responseModelFactories/userResponseModelFactory');

module.exports = class UserHttpHandler {
  constructor(event) {
    this.event = event;
  }

  async get() {
    const userId = this._validatePathParameters();
    const userHandler = new UserHandler(this.event);
    const user = await userHandler.getUser(userId);

    const response = userResponseModelFactory(user);
    return response;
  }

  async post() {
    this._validatePathParameters();
    const userParams = this._validatePostParameters();
    const userHandler = new UserHandler(this.event);
    const user = await userHandler.createUser(userParams);
    const response = {
      body: JSON.stringify({
        data: user,
        code: 200,
      }),
    };
    return response;
  }

  _validatePathParameters() {
    const { pathParameters } = this.event;
    if (!pathParameters || !pathParameters.id || Number.isNaN(Number(pathParameters.id))) {
      throw new common.errors.HttpError('Bad request. Missing or malformed path param id', 400);
    }
    return pathParameters.id;
  }

  _validatePostParameters() {
    if (!this.event.body || this.event.body === null || typeof this.event.body === 'undefined') throw new common.errors.HttpError('Missing request body', 400);

    const body = JSON.parse(this.event.body);
    const {
      id, name, birthday, gender,
    } = body;

    if (this._isNullOrEmpty([id, name, birthday, gender])) throw new common.errors.HttpError('Malformed request body', 400);

    if (this.event.pathParameters.id !== id) throw new common.errors.HttpError('Body id parameter not matching path parameter', 400);

    const userParams = {
      id, name, birthday, gender,
    };
    return userParams;
  }

  _isNullOrEmpty(params) {
    const nullOrEmpty = params.filter((param) => {
      if (!param || param === '' || typeof param !== 'string') return true;
    });
    return nullOrEmpty.length > 0;
  }
};
