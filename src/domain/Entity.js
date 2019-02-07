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

  delete(id, lastKnownGeoHash) {
    return this._entityRepository.destroy(id, lastKnownGeoHash)
      .then(res => Promise.resolve(res));
  }

  _update(entity, lastKnownGeoHash) {
    return this._entityRepository.update(entity, lastKnownGeoHash)
      .then(res => Promise.resolve(res));
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
      .then(res => Promise.resolve(res));
  }
}

module.exports = Entity;
