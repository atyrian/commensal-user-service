const common = require('commensal-common');
const UserHandler = require('./UserHandler');
const accountResponseModelFactory = require('./responseModelFactories/accountResponseModelFactory');
const { updateRequestParameters } = require('./constants/parameters');

module.exports = class AccountHttpHandler {
  constructor(event) {
    this.event = event;
  }

  async get() {
    const userId = this._validatePathParameters();
    const userHandler = new UserHandler(this.event);
    const user = await userHandler.getUser(userId);
    const response = accountResponseModelFactory(user);
    return response;
  }

  async put() {
    this._validatePathParameters();
    const params = this._validateRequestBody();
    const userHandler = new UserHandler(this.event);
    const data = await userHandler.updateUser(params);

    return this._generateResponse(data);
  }

  _validatePathParameters() {
    const { pathParameters } = this.event;
    if (!pathParameters || !pathParameters.id || isNaN(pathParameters.id)) {
      throw new common.errors.HttpError('Bad request. Missing or malformed path param id', 400);
    }
    return pathParameters.id;
  }

  _validateRequestBody() {
    if (!this.event.body || this.event.body === null || typeof this.event.body === 'undefined') throw new common.errors.HttpError('Missing request body', 400);

    const body = JSON.parse(this.event.body);
    if (!body.geohash) throw new common.errors.HttpError('Bad request. geohash required', 400);

    Object.keys(body)
      .forEach((key) => {
        if (!updateRequestParameters.includes(key)) {
          throw new common.errors.HttpError(`Bad request. Invalid key ${key} in request body`, 400);
        }
        if (key === updateRequestParameters[5] || key === updateRequestParameters[6]
          || key === updateRequestParameters[7]) {
          if (typeof body[key] !== 'object') throw new common.errors.HttpError('Venue parameter must be of type object', 400);
        }
      });

    return body;
  }

  _generateResponse(data) {
    const response = {
      body: JSON.stringify({
        data,
      }),
    };
    return response;
  }
};
