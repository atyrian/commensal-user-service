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

    const response = await this._save();
    return response;
  }

  async update(params) {
    const { attrs } = this.Items[0];
    const { geohash: recentHash } = attrs;
    this.populateTemplate(attrs, params);

    if (params.geohash && params.geohash === recentHash) {
      return this._update(attrs, recentHash);
    }
    // DynamoDB does not support updating hash or range keys.
    const response = await this.updateRangeKey(attrs, recentHash);
    return response;
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
