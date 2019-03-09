const common = require('commensal-common');
const Joi = require('joi');

class Validator {
  static validate(request, schema, customError) {
    return Joi.validate(request, schema, (err, value) => {
      if (err) {
        err.details.forEach((detail) => { // if custom error specified, override error message
          if (customError && customError[detail.context.key]) {
            const message = `${customError[detail.context.key]}. Key: ${detail.context.key}. Got: ${detail.context.value}`;
            throw new common.errors.HttpError(message, 400);
          }
          throw new common.errors.HttpError(err.details[0].message, 400);
        });
      }
      return value;
    });
  }
}

module.exports = Validator;
