const GraphQLSchema = require("graphql").GraphQLSchema;
const GraphQLObjectType = require("graphql").GraphQLObjectType;
const queryType = require("./queries/bookingQuery").BookingQuery;
const bookingMutations = require("./mutations/bookingMutations");

exports.BookingSchema = new GraphQLSchema({
  query: queryType,
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: bookingMutations,
  }),
});
