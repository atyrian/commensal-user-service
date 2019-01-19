const dynogels = require('dynogels');

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

  create() {

  }

  update() {

  }

  destroy() {

  }
}

module.exports = BaseRepository;
