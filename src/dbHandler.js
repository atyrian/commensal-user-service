const userDB = require('./database/Userdb');
const { stringSetAppendKeys } = require('./constants/parameters');

module.exports = class DatabaseHandler {
  async partialUpdate(params) {
    const { id } = params;
    delete params.id;
    const paramKeys = Object.keys(params);

    // Append new values to parameters that are string sets.
    paramKeys
      .filter(paramKey => stringSetAppendKeys.includes(paramKey))
      .forEach((stringSetKey) => {
        params[stringSetKey] = { $add: params[stringSetKey] };
      });

    if (Array.isArray(id)) {
      return Promise.all(
        id.map((uid) => {
          params.id = uid;
          return userDB.partialUpdate(params);
        }),
      );
    }

    params.id = id;
    return userDB.partialUpdate(params);
  }
};
