const common = require('commensal-common');
const moment = require('moment');
const UserHandler = require('../UserHandler');
const accountResponseModelFactory = require('../responseModelFactories/accountResponseModelFactory');
const DatabaseHandler = require('../dbHandler');
const searchParamsValidation = require('../validation/account/searchParams');
const profileValidation = require('../validation/account/profile');
const Validator = require('../validation/validator');

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
    if (this.event.path.match('/account/id/.[0-9]*/profile$')) {
      this._requestBodyExists(this.event.body);
      this._validatePathParameters();
      const values = Validator.validate(this.event.body, profileValidation.updateProfile);
      const userHandler = new UserHandler(this.event);
      const data = await userHandler.updateUser(values);

      return this._generateResponse(data);
    }

    if (this.event.path.match('/account/.[0-9]*/searchparams$')) {
      this._requestBodyExists(this.event.body);
      const id = this._validatePathParameters();
      const values = Validator.validate(this.event.body, searchParamsValidation.updateSearchParams);
      const { pref, geohash } = values;
      const last_active = moment().unix() + '';
      const params = { geohash, pref: parseInt(pref, 10), last_active };
      params.id = id;

      const dbHandler = new DatabaseHandler();
      const res = await dbHandler.partialUpdate(params);
      return this._generateResponse(res);
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

  _requestBodyExists(body) {
    if (!body || Object.entries(body).length === 0 || body === null || typeof body === 'undefined') throw new common.errors.HttpError('Missing request body', 400);
  }

  _generateResponse(data) {
    const response = {
      body: JSON.stringify({
        data,
        code: 200,
      }),
    };
    return response;
  }
};
