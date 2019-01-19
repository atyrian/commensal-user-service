const _ = require('lodash');
const common = require('commensal-common');

class Entity {
  constructor(id, entityRepository) {
    this._entityRepository = entityRepository;
    this._id = id;
    this._loaded = false;
  }

  load() {
    return this._load()
      .then((exists) => {
        if (exists) {
          return this;
        }
        return Promise.reject(new common.errors.HttpError('Resource not found', 404));
      });
  }

  _load() {
    if (this._loaded) Promise.resolve(this._exists);

    return this._entityRepository.getById(this._id)
      .then((entity) => {
        this._loaded = true;
        this._exists = entity ? true : false;
        if (this._exists) {
          _.assign(this, entity);
        }
        return Promise.resolve(this._exists);
      });
  }
}

module.exports = Entity;
