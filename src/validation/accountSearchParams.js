const Joi = require('joi');

const searchParams = {
  // PUT /account/searchparams
  updateSearchParams: {
    pref: Joi.string().regex(/^(0|1|2|3)$/),
    geohash: Joi.string().required().length(5),
  },
};
module.exports = searchParams;
