const Joi = require('joi');

const user = {
  // POST /user
  createUser: {
    id: Joi.string().required().regex(/^[0-9]*$/), // numeric only
    name: Joi.string().required(),
    birthday: Joi.string().required(), // TODO regex when format decided upon
    gender: Joi.string().required(),
  },
};
module.exports = user;
