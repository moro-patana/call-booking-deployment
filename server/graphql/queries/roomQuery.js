const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLID = require("graphql").GraphQLID;
const RoomModel = require("../models/room");
const roomType = require("../types/room").roomType;
const { getErrorForCode, ERROR_CODES } = require("../../utils/errorCodes");

// Query
exports.RoomQuery = new GraphQLObjectType({
  name: "Query",
  fields: () => {
    return {
      getRooms: {
        type: new GraphQLList(roomType),
        resolve: async () => {
          try {
            const rooms = await RoomModel.find()
              .populate("user")
              .populate("room")
              .sort({ name: -1 });

            if (!rooms) {
              throw new Error(getErrorForCode(ERROR_CODES.EA3));
            }
            return rooms;
          } catch (error) {
            throw new Error(error);
          }
        },
      },
      getRoom: {
        type: roomType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        resolve: async (_, { id }) => {
          try {
            const room = await RoomModel.findById(id)
              .populate("user")
              .populate("room");
            if (!room) {
              throw new Error(getErrorForCode(ERROR_CODES.EA2));
            }
            return room;
          } catch (error) {
            throw new Error(error);
          }
        },
      },
      getUserRooms: {
        type: new GraphQLList(roomType),
        args: {
          userId: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        resolve: async (_, { userId }) => {
          try {
            const rooms = await RoomModel.find({ user: userId })
              .populate("user")
              .populate("room")
              .sort({ name: -1 });

            console.log({ rooms });
            if (!rooms) {
              throw new Error(getErrorForCode(ERROR_CODES.EA3));
            }
            return rooms;
          } catch (error) {
            throw new Error(error);
          }
        },
      }
    };
  },
});
