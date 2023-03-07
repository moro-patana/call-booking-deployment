const bookingType = require("../types/booking");
const bookingModel = require("../models/booking");
const GraphQLString = require("graphql").GraphQLString;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLInputObjectType = require("graphql").GraphQLInputObjectType;
const GraphQLID = require("graphql").GraphQLID;
const GraphQLList = require("graphql").GraphQLList;
const checkAuth = require("../../utils/check-auth");
const { getErrorForCode, ERROR_CODES } = require("../../utils/errorCodes");

const argType = {
  roomId: { type: new GraphQLNonNull(GraphQLID) },
  label: { type: GraphQLString },
  startDate: { type: GraphQLString },
  endDate: { type: GraphQLString },
  participants: { type: GraphQLList(GraphQLID) }
}

module.exports = {
  createBooking: {
    type: bookingType.bookingType,
    args: argType,
    resolve: async (root, args, context) => {
      // const user = checkAuth(context);
      const {
        roomId,
        label,
        startDate,
        endDate,
        participants
      } = args;

      const uModel = new bookingModel({
        participants,
        roomId,
        label,
        startDate,
        endDate,
      });

      const newBooking = await uModel.save();
      const populatedBooking = newBooking.populate("booking").populate("room").populate("user");
      if (!newBooking) {
        throw new Error(getErrorForCode(ERROR_CODES.EA1));
      }
      return populatedBooking
    },
  },
  deleteBooking: {
    type: bookingType.bookingType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, args, context) => {
      const user = checkAuth(context);
      const bookingToRemove = await bookingModel.findById(args.id);
      
      if (!bookingToRemove) {
        throw new Error(getErrorForCode(ERROR_CODES.EA2));
      }

      try {
        if (user.id === bookingToRemove.user.id) {
          await bookingToRemove.delete();

            return {
              username: bookingToRemove.user.username,
              id: bookingToRemove.id,
              label: bookingToRemove.label,
            };
          } else {
            throw new Error(getErrorForCode(ERROR_CODES.EG1));
          }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  updateBooking: {
    type: bookingType.bookingType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      roomId: { type: new GraphQLNonNull(GraphQLID) },
      label: { type: GraphQLString },
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
      user: { type: new GraphQLInputObjectType({
        name: 'UserInput',
        fields: () => ({
          id:          { type: GraphQLID },
          username: { type: GraphQLString },
          email:    { type: GraphQLString }, 
        })
      }) }
    },
    resolve: async (root, args, context) => {
      const user = checkAuth(context);
      const bookingToUpdate = await bookingModel.findById(args.id);
      if (!bookingToUpdate) {
        throw new Error(getErrorForCode(ERROR_CODES.EA2));
      }
      const updatedArgs = {
        ...args,
      };

      try {
        if (user.id === bookingToUpdate.user.id) {
          const updatedBooking = await bookingModel
          .findByIdAndUpdate(args.id, updatedArgs, {
              new: true,
          })
          .populate("booking")
          .populate("room")
          .populate("user");
  
          if (!updatedBooking) {
              throw new Error(getErrorForCode(ERROR_CODES.EA2));
          }
          return updatedBooking;
        } else {
          throw new Error(getErrorForCode(ERROR_CODES.EG1));
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};