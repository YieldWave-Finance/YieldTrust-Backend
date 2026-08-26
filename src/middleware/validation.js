function validationError(res, details) {
  return res.status(400).json({
    success: false,
    error: 'Invalid request',
    details,
  });
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const rules = {
  requiredString: (field) => (body) => {
    if (typeof body[field] !== 'string' || body[field].trim() === '') {
      return `${field} must be a non-empty string`;
    }
    return null;
  },
  optionalString: (field) => (body) => {
    if (body[field] !== undefined && typeof body[field] !== 'string') {
      return `${field} must be a string`;
    }
    return null;
  },
  positiveNumber: (field) => (body) => {
    if (typeof body[field] !== 'number' || body[field] <= 0) {
      return `${field} must be a positive number`;
    }
    return null;
  },
  optionalPositiveNumber: (field) => (body) => {
    if (body[field] !== undefined && (typeof body[field] !== 'number' || body[field] <= 0)) {
      return `${field} must be a positive number`;
    }
    return null;
  },
  optionalEnum: (field, values) => (body) => {
    if (body[field] !== undefined && !values.includes(body[field])) {
      return `${field} must be one of: ${values.join(', ')}`;
    }
    return null;
  },
};

function validateBody(ruleSet) {
  return (req, res, next) => {
    if (!isObject(req.body)) {
      return validationError(res, ['body must be a JSON object']);
    }

    const details = ruleSet.map((rule) => rule(req.body)).filter(Boolean);
    if (details.length > 0) {
      return validationError(res, details);
    }

    return next();
  };
}

function validateQuery(allowedKeys) {
  return (req, res, next) => {
    const unknownKeys = Object.keys(req.query).filter((key) => !allowedKeys.includes(key));
    if (unknownKeys.length > 0) {
      return validationError(res, unknownKeys.map((key) => `${key} is not a supported query parameter`));
    }
    return next();
  };
}

function validateIdParam(paramName = 'id') {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!/^[1-9]\d*$/.test(value)) {
      return validationError(res, [`${paramName} must be a positive integer`]);
    }
    return next();
  };
}

module.exports = {
  rules,
  validateBody,
  validateQuery,
  validateIdParam,
};
