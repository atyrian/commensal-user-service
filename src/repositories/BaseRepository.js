const dynogels = require('dynogels');
const common = require('commensal-common');

class BaseRepository {
  constructor(name, definition, tableName, index) {
    this._db = dynogels.define(name, definition);
    this._db.config(tableName);
    this._index = index;
  }

  getById(userId) {
    return new Promise((resolve, reject) => {
      this._db.query(userId)
        .exec((err, resp) => {
          if (err) reject(err);
          else {
            resolve(resp);
          }
        });
    });
  }

  create(entity) {
    this._validate(entity);
    return new Promise((resolve, reject) => {
      this._db.create(entity, (err, resp) => {
        if (err) {
          reject(new common.errors.HttpError('Error saving user to database', 500));
        }
        resolve(resp);
      });
    });
  }

  update(entity, lastKnownGeoHash) {
    this._validate(entity);
    return new Promise((resolve, reject) => {
      this._db.update(entity, { expected: { geohash: lastKnownGeoHash } }, (err, resp) => {
        if (err) {
          if (err.name === 'ConditionalCheckFailedException') {
            return reject(new common.errors.HttpError('geohash out of sync', 400));
          }
          return reject(err);
        }
        return resolve(resp);
      });
    });
  }

  destroy(id, geohash) {
    return new Promise((resolve, reject) => {
      this._db.destroy(id, geohash, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(true);
      });
    });
  }

  _validate(entity) {
    entity._entityRepository ? delete entity._entityRepository : null;

    Object.keys(entity).filter(key => key.startsWith('_'))
      .forEach(k => delete entity[k]);
  }
}

module.exports = BaseRepository;
