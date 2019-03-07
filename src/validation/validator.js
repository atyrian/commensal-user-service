const common = require('commensal-common');
const Joi = require('joi');

class Validator {
  static validate(request, schema) {
    return Joi.validate(request, schema, (err, value) => {
      if (err) {
        throw new common.errors.HttpError(err.details[0].message, 400);
      }
      return value;
    });
  }
}

module.exports = Validator;
