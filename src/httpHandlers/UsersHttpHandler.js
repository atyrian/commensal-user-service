const common = require('commensal-common');
const DatabaseHandler = require('../dbHandler');

module.exports = class UsersHttpHandler {
  constructor(event) {
    this.event = event;
  }

  async usersPut() {
    switch (this.event.path) {
      case '/users/match':
        return this.updateMatches();
      default:
        throw new common.errors.HttpError(`Method not supported for endpoint: ${this.event.path}`, 405);
    }
  }

  async updateMatches() {
    const params = this._validateQueryParameters();
    const dbHandler = new DatabaseHandler();
    const res = await dbHandler.partialUpdate(params);
    const response = { body: JSON.stringify({ data: res, code: 200 }) };
    return response;
  }

  _validateQueryParameters() {
    const { queryStringParameters, multiValueQueryStringParameters } = this.event;

    if (!queryStringParameters
      || !queryStringParameters.matchid
      || !multiValueQueryStringParameters
      || !multiValueQueryStringParameters.userid
      || multiValueQueryStringParameters.userid.length !== 2) {
      throw new common.errors.HttpError('Bad request. Expected matchid and array of userid of length 2', 400);
    }

    multiValueQueryStringParameters.userid
      .forEach((id) => {
        if (Number.isNaN(Number(id))) {
          throw new common.errors.HttpError('Expected numeric userid', 400);
        }
      });

    const resp = {
      id: multiValueQueryStringParameters.userid,
      match_id: queryStringParameters.matchid,
    };
    return resp;
  }
};
