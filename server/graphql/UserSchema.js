const queryType = require("./queries/userQuery").UserQuery;
const mutations = require("./mutations/userMutations");
const { GraphQLObjectType, GraphQLSchema } = require('graphql');

exports.UserSchema = new GraphQLSchema({
  query: queryType,
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: mutations,
  }),
});
