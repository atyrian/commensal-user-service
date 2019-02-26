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
          return Promise.resolve(this);
        }
        return Promise.reject(new common.errors.HttpError('Resource not found', 404));
      });
  }

  delete(id) {
    return this._entityRepository.destroy(id)
      .then(res => res);
  }

  _update(entity) {
    return this._entityRepository.update(entity)
      .then(res => res);
  }

  _load() {
    if (this._loaded) Promise.resolve(this._exists);

    return this._entityRepository.getById(this._id)
      .then((entity) => {
        this._loaded = true;
        this._exists = entity.Count > 0 ? true : false;
        if (this._exists) {
          _.assign(this, entity);
        }
        return Promise.resolve(this._exists);
      });
  }

  _save(entity) {
    return this._entityRepository.create(entity)
      .then(res => res);
  }
}

module.exports = Entity;
