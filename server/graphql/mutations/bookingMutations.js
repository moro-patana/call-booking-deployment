const bookingType = require("../../types/booking");
const { userType } = require("../../types/user");
const bookingModel = require("../../models/booking");
const roomModel = require("../../models/room");
const GraphQLString = require("graphql").GraphQLString;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLID = require("graphql").GraphQLID;
const checkAuth = require("../../utils/check-auth");
const { getErrorForCode, ERROR_CODES } = require("../../utils/errorCodes");

const argType = {
  roomId: { type: new GraphQLNonNull(GraphQLID) },
  label: { type: GraphQLString },
  startDate: { type: GraphQLString },
  endDate: { type: GraphQLString },
}

module.exports = {
  createBooking: {
    type: bookingType.bookingType,
    args: argType,
    resolve: async (root, args, context) => {
      const user = checkAuth(context);
      const {
        roomId,
        label,
        startDate,
        endDate,
      } = args;

      const uModel = new bookingModel({
        user: user,
        roomId,
        label,
        startDate,
        endDate,
      });

      const newBooking = await uModel.save();
      const populatedBooking = newBooking.populate("booking").populate("room").populate("user");
      console.log('populatedBooking::::::', populatedBooking);
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
    args: argType,
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
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
