const { getErrorForCode, ERROR_CODES } = require("./errorCodes");

module.exports.validateRegisterInput = (
  username,
  email,
  password,
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = getErrorForCode(ERROR_CODES.EU1);
  }
  if (email.trim() === "") {
    errors.email = getErrorForCode(ERROR_CODES.EU5);
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) {
      errors.email = getErrorForCode(ERROR_CODES.EU6);
    }
  }

  if (!password || password.length < 8) {
    errors.password = getErrorForCode(ERROR_CODES.EU7);
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};