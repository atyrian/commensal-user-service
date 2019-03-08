const Joi = require('joi');

const partial = {
  // PUT /user/partial
  updatePartial: {
    shown_to: Joi.string().required().regex(/^[0-9]*$/), // numeric only
  },
};
module.exports = partial;
