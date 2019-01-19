const Db = require('./Database');
const User = require('./domain/User');

module.exports = class UserHandler {
  constructor(event) {
    this.event = event;
  }

  async getUser(userId) {
    try {
      const user = await this._getUser(userId);
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createUser(userParams) {
    try {
      this._sanitizeData(userParams);
      this._formatData(userParams);
      const user = await this._createUser(userParams);
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async _getUser(userId) {
    try {
      const user = new User(userId);
      await user.load();
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  _createUser(userParams) {
    return new Promise((resolve, reject) => {
      Db.Users.create({
        geohash: ' ',
        id: `${userParams.id}`,
        last_active: ' ',
        match_id: [' '],
        person: {
          bio: ' ',
          birthday: `${userParams.birthday}`,
          fav_venues: {
            venue_1: {},
            venue_2: {},
            venue_3: {},
          },
          gender: `${userParams.gender}`,
          last_name: `${userParams.last_name}`,
          name: `${userParams.name}`,
          photos: {
            photo_1: ' ',
            photo_2: ' ',
            photo_3: ' ',
          },
        },
        pref: 0,
        shown_to: [' '],
      }, (err, user) => {
        if (err) {
          reject(err);
        } else {
          const resp = {

            Items: [
              user.get(),
            ],

          };
          resolve(resp);
        }
      });
    });
  }

  _sanitizeData(userParams) {
    if (!userParams.name.match(/^[a-öA-Ö\s]*$/)) {
      throw new Error('Illegal characters in name');
    }

    for (const value in userParams) {
      userParams[value] = this._stripHTML(userParams[value]);
    }
  }

  _stripHTML(value) {
    return value = value.replace(/<[^>]+>/g, '');
  }

  _formatData(userParams) {
    const names = userParams.name.split(' ');
    userParams.last_name = names.length >= 2 ? names[1] : ' ';
    userParams.name = names[0];

    switch (userParams.gender) {
      case 'male': {
        userParams.gender = 0;
        break;
      }
      case 'female': {
        userParams.gender = 1;
        break;
      }
      default: {
        userParams.gender = 3;
        break;
      }
    }
  }
};
