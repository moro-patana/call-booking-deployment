const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLID = require("graphql").GraphQLID;
const GraphQLString = require("graphql").GraphQLString;

exports.bookingType = new GraphQLObjectType({
  name: "booking",
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
      userId: {
        type: new GraphQLNonNull(GraphQLID),
      },
      roomId: {
        type: new GraphQLNonNull(GraphQLID),
      },
      label: {
        type: GraphQLString,
      },
      startDate: {
        type: GraphQLString,
      },
      endDate: {
        type: GraphQLString,
      },
    };
  },
});