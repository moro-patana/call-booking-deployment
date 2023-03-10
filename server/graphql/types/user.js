const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const { GraphQLID, GraphQLString, GraphQLFloat } = require("graphql");

exports.userType = new GraphQLObjectType({
  name: "user",
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      username: {
        type: new GraphQLNonNull(GraphQLString),
      },
      password: {
        type: new GraphQLNonNull(GraphQLString),
      },
      access_token: {
        type: new GraphQLNonNull(GraphQLString),
      },
      picture: {
        type: new GraphQLNonNull(GraphQLString),
      },
      hd: {
        type: new GraphQLNonNull(GraphQLString),
      },
      expires_in: {
        type: new GraphQLNonNull(GraphQLFloat),
      }
    };
  },
});