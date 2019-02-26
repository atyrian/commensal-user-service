const _ = require('lodash');
const Entity = require('./Entity');
const UserRepository = require('../repositories/UserRepository');
const userTemplate = require('./templates/user');

class User extends Entity {
  constructor(id) {
    super(id, new UserRepository());
  }

  async save(params) {
    this.populateTemplate(userTemplate, params);
    userTemplate.id = this._id;
    _.assign(this, userTemplate);

    const response = await this._save(this);
    return response;
  }

  async update(params) {
    const { attrs: model } = this.Items[0];
    this.populateTemplate(model, params);
    return this._update(model);
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
