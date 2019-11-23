const common = require('commensal-common');
const Joi = require('joi');
const dynogels = require('dynogels');

dynogels.AWS.config.update({ region: process.env.REGION });

const User = dynogels.define('User', {
  hashKey: 'id',
  timestamps: true,
  createdAt: 'created_at',
  schema: {
    id: Joi.string(),
    geohash: Joi.string(),
    last_active: Joi.string(),
    match_id: dynogels.types.stringSet(),
    person: {
      bio: Joi.string().allow(''),
      fav_venues: {
        venue_0: {
          venue_location: Joi.string(),
          venue_name: Joi.string(),
          venue_photo: Joi.string(),
        },
        venue_1: {
          venue_location: Joi.string(),
          venue_name: Joi.string(),
          venue_photo: Joi.string(),

        },
        venue_2: {
          venue_location: Joi.string(),
          venue_name: Joi.string(),
          venue_photo: Joi.string(),
        },
      },
      gender: Joi.number().required(),
      last_name: Joi.string().required(),
      name: Joi.string().required(),
      birthday: Joi.string().required(),
      photos: {
        photo_0: Joi.string().allow(''),
        photo_1: Joi.string().allow(''),
        photo_2: Joi.string().allow(''),
      },
    },
    pref: Joi.number(),
    shown_to: dynogels.types.stringSet(),
    validation: {
      allowUnknown: false,
    },
  },
  tableName: process.env.TABLE_NAME,
});

const partialUpdate = data => new Promise((resolve, reject) => {
  User.update(data, { expected: { id: { Exists: true } } }, (err, user) => {
    if (err && err.ConditionalCheckFailedException) {
      return reject(new common.errors.HttpError(`User with id ${data.id} not found`, 500));
    }
    if (err) {
      return reject(new common.errors.HttpError('Error updating user', 500));
    }
    return resolve({ id: user.get('id'), success: true });
  });
});


const UserDB = { partialUpdate };

module.exports = UserDB;
