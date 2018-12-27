const dynogels = require('dynogels');
const Joi = require('joi');

dynogels.AWS.config.update({ region: process.env.REGION });

const db = module.exports;

db.Users = dynogels.define('User', {
  hashKey: 'id',
  rangeKey: 'geohash',
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
        venue_3: {
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
        photo_1: Joi.string().allow(''),
        photo_2: Joi.string().allow(''),
        photo_3: Joi.string().allow(''),
      },
    },
    pref: Joi.number(),
    shown_to: dynogels.types.stringSet(),
    validation: {
      allowUnknown: false,
    },
  },
});

db.Users.config({ tableName: 'commensal-user' });
