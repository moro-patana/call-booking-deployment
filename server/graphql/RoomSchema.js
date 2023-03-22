const queryType = require("./queries/roomQuery").RoomQuery;
const mutations = require("./mutations/roomMutations");
const { GraphQLObjectType, GraphQLSchema } = require('graphql');

exports.RoomSchema = new GraphQLSchema({
  query: queryType,
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: mutations,
  }),
});
