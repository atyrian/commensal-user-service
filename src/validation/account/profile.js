const Joi = require('joi');

const profile = {
  // PUT /account/profile
  updateProfile: {
    bio: Joi.string().max(250, 'utf8'),
    photo_1: Joi.string(), // probably FB url pattern match.
    photo_2: Joi.string(),
    photo_3: Joi.string(),
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
};
module.exports = profile;
