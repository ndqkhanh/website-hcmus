const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const email = (value, helpers) => {
  if (value.length < 5 || value.length > 15) {
    return helpers.message('email must be in range 5-15 characters');
  }
  if (value.match(/ /)) {
    return helpers.message('email must not contain spaces');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const status = (value, helpers) => {
  if (value !== 1 && value !== 0) {
    return helpers.message('status must be 0 or 1 (approved or declined)');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  email,
  status,
};
