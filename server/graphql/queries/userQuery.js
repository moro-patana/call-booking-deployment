const UserModel = require("../models/user");
const userType = require("../types/user").userType;
const { getErrorForCode, ERROR_CODES } = require("../../utils/errorCodes");
const { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');

// Query
exports.UserQuery = new GraphQLObjectType({
  name: "Query",
  fields: () => {
    return {
      getUsers: {
        type: new GraphQLList(userType),
        resolve: async () => {
          const users = await UserModel.find();
          if (!users) {
            throw new Error(getErrorForCode(ERROR_CODES.EA2));
          }
          return users;
        },
      },
      getUserById: {
        type: userType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        resolve: async (_, { id }) => {
          const user = await UserModel.findById(id);

          if (!user) {
            throw new Error(getErrorForCode(ERROR_CODES.EA2));
          }
          return user;
        },
      },
    };
  },
});
