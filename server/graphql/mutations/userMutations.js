const userType = require("../types/user");
const usersModel = require("../models/user");
const JWT_SECRET = require("../../config").JWT_SECRET;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLInputObjectType = require("graphql").GraphQLInputObjectType;
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const checkAuth = require("../../utils/check-auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getErrorForCode, ERROR_CODES } = require("../../utils/errorCodes");

const RegisterInput = new GraphQLInputObjectType({
  name: "RegisterInput",
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = {
  register: {
    type: userType.userType,
    args: {
      registerInput: {
        type: RegisterInput,
      },
    },
    resolve: async (root, args) => {
      const {
        registerInput: { password, username, email },
      } = args;

      const existingUser = await usersModel.findOne({ username });
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password
      );

      if (!valid) {
        throw new Error(`Errors ${JSON.stringify(errors)}`);
      }

      if (existingUser) {
        throw new Error(getErrorForCode(ERROR_CODES.EU2));
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const uModel = new usersModel({
        password: hashedPassword,
        email,
        username,
      });
      
      const res = await uModel.save();
      
      if (!res) {
        throw new Error(getErrorForCode(ERROR_CODES.EU3));
      }

      const token = generateToken(res);
      const userData = { ...res._doc, id: res._id, token };
      return userData;
    },
  },
  login: {
    type: userType.userType,
    args: {
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      password: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, { email, password }) => {
      const { errors, valid } = validateLoginInput(email, password);

      const existingUser = await usersModel.findOne({ email });

      if (!valid) {
        throw new Error(errors);
      }

      if (!existingUser) {
        const errNoUser = getErrorForCode(ERROR_CODES.EU12);
        errors.general = errNoUser;
        throw new Error(errNoUser);
      }

      const match = await bcrypt.compare(password, existingUser.password);

      if (!match) {
        const errNoUser = getErrorForCode(ERROR_CODES.EU13);
        errors.general = errNoUser;
        throw new Error(errNoUser);
      }
      const token = generateToken(existingUser);

      const userData = { ...existingUser._doc, id: existingUser._id, token };
      return userData;
    },
  },
};