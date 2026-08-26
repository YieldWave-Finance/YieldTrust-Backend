const Joi = require('joi');

const escrowCreateSchema = Joi.object({
  amount: Joi.number().positive().required(),
  beneficiary: Joi.string().min(1).max(255).required(),
  releaseDate: Joi.date().iso().allow(null, ''),
  description: Joi.string().max(1000).allow('', null),
});

const escrowUpdateSchema = Joi.object({
  amount: Joi.number().positive(),
  beneficiary: Joi.string().min(1).max(255),
  releaseDate: Joi.date().iso().allow(null, ''),
  description: Joi.string().max(1000).allow('', null),
  status: Joi.string().valid('pending', 'active', 'completed', 'disputed'),
}).min(1);

const grantCreateSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().min(3).max(10).required(),
  beneficiary: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).allow('', null),
});

const grantUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(200),
  amount: Joi.number().positive(),
  currency: Joi.string().min(3).max(10),
  beneficiary: Joi.string().min(1).max(255),
  description: Joi.string().max(1000).allow('', null),
  status: Joi.string().valid('pending', 'active', 'completed', 'disputed'),
}).min(1);

const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'disbursed', 'rejected').required(),
});

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map(d => ({ field: d.path.join('.'), message: d.message }));
      return res.status(400).json({
        error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details },
      });
    }
    req[source] = value;
    next();
  };
}

module.exports = {
  validate,
  escrowCreateSchema,
  escrowUpdateSchema,
  grantCreateSchema,
  grantUpdateSchema,
  statusUpdateSchema,
};
