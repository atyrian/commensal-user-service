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
    const { attrs } = this.Items[0];
    const { geohash: lastKnownGeoHash } = attrs;
    this.populateTemplate(attrs, params);

    if (params.geohash && params.geohash === lastKnownGeoHash) {
      return this._update(attrs, lastKnownGeoHash);
    }
    // DynamoDB does not support updating hash or range keys.
    await this.delete(attrs.id, lastKnownGeoHash);
    const response = this._save(attrs);
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
