const _ = require('lodash');
const Entity = require('./Entity');
const UserRepository = require('../repositories/UserRepository');
const userTemplate = require('./templates/user');

class User extends Entity {
  constructor(id) {
    super(id, new UserRepository());
  }

  save(params) {
    this.populateTemplate(userTemplate, params);
    userTemplate.id = this._id;
    _.assign(this, userTemplate);

    return this._save()
      .then(res => Promise.resolve(res))
      .catch(err => Promise.reject(err));
  }

  populateTemplate(template, params) {
    const paramKeys = Object.keys((params));

    for (const key in template) {
      if (paramKeys.includes(key)) {
        template[key] = params[key];
        const index = paramKeys.indexOf(key);
        paramKeys.splice(index, 1);
      }
      if (typeof template[key] === 'object') {
        this.populateTemplate(template[key], params);
      }
    }
  }
}

module.exports = User;
