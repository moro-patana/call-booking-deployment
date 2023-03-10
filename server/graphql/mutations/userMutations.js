const { GraphQLFloat, GraphQLString, GraphQLInputObjectType, GraphQLNonNull } = require("graphql");
const userType = require("../types/user");
const usersModel = require("../models/user");
const { JWT_SECRET } = require("../../config");
const { validateRegisterInput } = require("../../utils/validators");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getErrorForCode, ERROR_CODES } = require("../../utils/errorCodes");

const loginInput = new GraphQLInputObjectType({
  name: "loginInput",
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    access_token: { type: new GraphQLNonNull(GraphQLString) },
    picture: { type: new GraphQLNonNull(GraphQLString) },
    hd: { type: new GraphQLNonNull(GraphQLString) },
    expires_in: { type: new GraphQLNonNull(GraphQLFloat) },
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
  login: {
    type: userType.userType,
    args: {
      loginInput: {
        type: loginInput,
      },
    },
    resolve: async (_root, args) => {
      const {
        loginInput: { password, username, email, access_token, picture, expires_in, hd },
      } = args;

      const existingUser = await usersModel.findOne({ email });
      const { errors, valid } = validateRegisterInput(username, email, password);

      if (!valid) {
        throw new Error(`Errors ${JSON.stringify(errors)}`);
      }

      if (existingUser) {
        const token = generateToken(existingUser);
        const userData = { ...existingUser._doc, id: existingUser._id, token };
        return userData;
      } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        const uModel = new usersModel({
          password: hashedPassword,
          email,
          username,
          access_token,
          picture,
          expires_in,
          hd
        });

        const res = await uModel.save();
        if (!res) {
          throw new Error(getErrorForCode(ERROR_CODES.EU3));
        };
        const token = generateToken(res);
        const userData = { ...res._doc, id: res._id, token };
        return userData;
      }
    }
  }
};