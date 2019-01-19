const Entity = require('./Entity');
const UserRepository = require('../repositories/UserRepository');

class User extends Entity {
  constructor(id) {
    super(id, new UserRepository());
  }
}

module.exports = User;
