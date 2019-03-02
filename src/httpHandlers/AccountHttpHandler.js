const common = require('commensal-common');
const UserHandler = require('../UserHandler');
const accountResponseModelFactory = require('../responseModelFactories/accountResponseModelFactory');
const { updateRequestParameters } = require('../constants/parameters');
const DatabaseHandler = require('../dbHandler');

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
    if (this.event.path.match('/account/.[0-9]*/profile$')) {
      this._validatePathParameters();
      const params = this._validateRequestBody(true);
      const userHandler = new UserHandler(this.event);
      const data = await userHandler.updateUser(params);

      return this._generateResponse(data);
    }

    if (this.event.path.match('/account/.[0-9]*/searchparams$')) {
      const id = this._validatePathParameters();
      const params = this._validateRequestBody(null, true);
      const dbHandler = new DatabaseHandler();
      params.id = id;
      const res = await dbHandler.partialUpdate(params);

      const response = {
        body: JSON.stringify({
          data: res,
          code: 200,
        }),
      };
      return response;
    }
    throw new common.errors.HttpError(`HTTP PUT not supported for endpoint: ${this.event.path}`, 405);
  }

  _validatePathParameters() {
    const { pathParameters } = this.event;
    if (!pathParameters || !pathParameters.id || Number.isNaN(Number(pathParameters.id))) {
      throw new common.errors.HttpError('Bad request. Missing or malformed path param id', 400);
    }
    return pathParameters.id;
  }

  _validateRequestBody(profileParams = null, searchParams = null) {
    if (!this.event.body || this.event.body === null || typeof this.event.body === 'undefined') throw new common.errors.HttpError('Missing request body', 400);

    if (profileParams) {
      const body = JSON.parse(this.event.body);

      Object.keys(body)
        .forEach((key) => {
          if (!updateRequestParameters.includes(key)) {
            throw new common.errors.HttpError(`Bad request. Invalid key ${key} in request body`, 400);
          }
          if (key === updateRequestParameters[5]
            || key === updateRequestParameters[6]
            || key === updateRequestParameters[7]) {
            if (typeof body[key] !== 'object') throw new common.errors.HttpError('Venue parameter must be of type object', 400);
          }
        });
      return body;
    }
    if (searchParams) {
      const body = JSON.parse(this.event.body);

      if (this._isNullOrEmpty([body.geohash, body.pref])) throw new common.errors.HttpError('Malformed request body. Expected pref and geohash', 400);
      if (Number.isNaN(Number(body.pref))) throw new common.errors.HttpError('Bad request. pref must be numeric', 400);

      const pref = parseInt(body.pref, 10);
      const resp = { geohash: body.geohash, pref };
      return resp;
    }
  }

  _generateResponse(data) {
    const response = {
      body: JSON.stringify({
        data,
      }),
    };
    return response;
  }

  _isNullOrEmpty(params) {
    const nullOrEmpty = params.filter((param) => {
      if (!param || param === '') return true;
    });
    return nullOrEmpty.length > 0;
  }
};
