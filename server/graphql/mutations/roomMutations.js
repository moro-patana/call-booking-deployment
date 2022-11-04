const roomType = require("../../types/room");
const roomModel = require("../../models/room");
const GraphQLString = require("graphql").GraphQLString;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const checkAuth = require("../../utils/check-auth");
const { getErrorForCode, ERROR_CODES } = require("../../utils/errorCodes");

module.exports = {
  createRoom: {
    type: roomType.roomType,
    args: {
      name: {
        type: GraphQLString,
      },
      description: {
        type: GraphQLString,
      },
    },
    resolve: async (root, args, context) => {
      const user = checkAuth(context);
      const {
        name,
        description,
      } = args;

      const uModel = new roomModel({
        name,
        description,
      });

      const newRoom = await uModel.save();
      if (!newRoom) {
        throw new Error(getErrorForCode(ERROR_CODES.EA1));
      }
      return newRoom.populate("room").populate("user");
    },
  },
  rooms: {
    type: roomType.roomType,
    args: {
      name: {
        type: GraphQLString,
      },
      description: {
        type: GraphQLString,
      },
    },
    resolve: async (root, args, context) => {
      const user = checkAuth(context);
      const {
        name,
        description,
      } = args;

      const uModel = new roomModel([{
        name,
        description,
      }]);

      const newRoom = await uModel.get();
      if (!newRoom) {
        throw new Error(getErrorForCode(ERROR_CODES.EA1));
      }
      return newRoom.populate("room").populate("user");
    },
  },
  deleteRoom: {
    type: roomType.roomType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, args, context) => {
      console.log(args, "args");
      const user = checkAuth(context);
      const roomToRemove = await roomModel.findById(args.id);
      console.log('user::::::', user);
      console.log('roomToRemove::::::', roomToRemove);
      if (!roomToRemove) {
        throw new Error(getErrorForCode(ERROR_CODES.EA2));
      }

      try {
          await roomToRemove.delete();
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
