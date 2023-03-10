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
      participants: {
        type: GraphQLList(GraphQLID),
      },
      resourceId: {
        type: GraphQLID,
      },
      title: {
        type: GraphQLString,
      },
      description: {
        type: GraphQLString,
      },
      start: {
        type: GraphQLString,
      },
      end: {
        type: GraphQLString,
      },
    };
  },
});