const roomType = require("../types/room");
const roomModel = require("../models/room");
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
      const {
        name,
        description,
      } = args;

      const newRoomModel = new roomModel({
        name,
        description,
      });

      const newRoom = await newRoomModel.save();
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
      const roomToRemove = await roomModel.findById(args.id);
      
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
  updateRoom: {
    type: roomType.roomType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        type: GraphQLString,
      },
      description: {
        type: GraphQLString,
      },
    },
    resolve: async (root, args, context) => {
      const roomToUpdate = await roomModel.findById(args.id);
      if (!roomToUpdate) {
        throw new Error(getErrorForCode(ERROR_CODES.EA2));
      }
      const updatedArgs = {
        ...args,
      };

      try {
        const updatedRoom = await roomModel
        .findByIdAndUpdate(args.id, updatedArgs, {
            new: true,
        })
        .populate("room")
        .populate("user");

        if (!updatedRoom) {
            throw new Error(getErrorForCode(ERROR_CODES.EA2));
        }
        return updatedRoom;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
