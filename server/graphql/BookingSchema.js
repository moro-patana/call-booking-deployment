const queryType = require("./queries/bookingQuery").BookingQuery;
const bookingMutations = require("./mutations/bookingMutations");
const { GraphQLObjectType, GraphQLSchema } = require('graphql');

exports.BookingSchema = new GraphQLSchema({
  query: queryType,
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: bookingMutations,
  }),
});
