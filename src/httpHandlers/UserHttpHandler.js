const common = require('commensal-common');
const UserHandler = require('../UserHandler');
const userResponseModelFactory = require('../responseModelFactories/userResponseModelFactory');
const DatabaseHandler = require('../dbHandler');
const Validator = require('../validation/validator');
const partialValidation = require('../validation/user/partial');
const userValidation = require('../validation/user/user');


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

  async put() {
    if (this.event.path.match('/user/.[0-9]*/partial$')) {
      const id = this._validatePathParameters();
      const values = Validator.validate(this.event.body, partialValidation.updatePartial);
      values.id = id;

      const dbHandler = new DatabaseHandler();
      const res = await dbHandler.partialUpdate(values);
      const response = { body: JSON.stringify({ data: res, code: 200 }) };
      return response;
    }

    throw new common.errors.HttpError(`HTTP PUT not supported for endpoint: ${this.event.path}`, 405);
  }

  async post() {
    this._validatePathParameters();
    const values = Validator.validate(this.event.body, userValidation.createUser);
    const userHandler = new UserHandler(this.event);
    const user = await userHandler.createUser(values);
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
};
