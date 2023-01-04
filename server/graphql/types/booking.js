const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLID = require("graphql").GraphQLID;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLList = require("graphql").GraphQLList;

exports.bookingType = new GraphQLObjectType({
  name: "booking",
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
      partecipants: {
        type: GraphQLList(GraphQLID),
      },
      roomId: {
        type: GraphQLID,
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