const _ = require('lodash');
const Entity = require('./Entity');
const UserRepository = require('../repositories/UserRepository');
const userTemplate = require('./templates/user');

class User extends Entity {
  constructor(id) {
    super(id, new UserRepository());
  }

  save(params) {
    this.populateEntity(params);
    return this._save()
      .then(res => Promise.resolve(res))
      .catch(err => Promise.reject(err));
  }
  // change to recursive function and subject to test!

  populateEntity(params) {
    userTemplate.id = this._id;
    const paramKeys = Object.keys((params));

    for (const property in userTemplate) {
      if (paramKeys.includes(property)) {
        userTemplate[property] = params[property];
      }
      if (typeof userTemplate[property] === 'object') {
        for (const key in userTemplate[property]) {
          if (paramKeys.includes(key)) {
            userTemplate[property][key] = params[key];
          }
        }
      }
    }
    _.assign(this, userTemplate);
  }
}

module.exports = User;
