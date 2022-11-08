const bookingType = require("../../types/booking");
const bookingModel = require("../../models/booking");
const GraphQLString = require("graphql").GraphQLString;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLID = require("graphql").GraphQLID;
const checkAuth = require("../../utils/check-auth");
const { getErrorForCode, ERROR_CODES } = require("../../utils/errorCodes");

module.exports = {
  createBooking: {
    type: bookingType.bookingType,
    args: {
      userId: { type: GraphQLID },
      roomId: { type: GraphQLID },
      label: { type: GraphQLString },
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
    },
    resolve: async (root, args, context) => {
      const user = checkAuth(context);
      const {
        userId,
        roomId,
        label,
        startDate,
        endDate,
      } = args;

      const uModel = new bookingModel({
        userId,
        roomId,
        label,
        startDate,
        endDate,
      });

      const newBooking = await uModel.save();
      if (!newBooking) {
        throw new Error(getErrorForCode(ERROR_CODES.EA1));
      }
      return newBooking.populate("room").populate("user");
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
      console.log(args, "args");
      const user = checkAuth(context);
      const bookingToRemove = await bookingModel.findById(args.id);
      
      if (!bookingToRemove) {
        throw new Error(getErrorForCode(ERROR_CODES.EA2));
      }

      try {
          await bookingToRemove.delete();
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  updateBooking: {
    type: bookingType.bookingType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      userId: { type: GraphQLID },
      roomId: { type: GraphQLID },
      label: { type: GraphQLString },
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
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
        const updatedBooking = await bookingModel
        .findByIdAndUpdate(args.id, updatedArgs, {
            new: true,
        })
        .populate("booking")
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
