const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLID = require("graphql").GraphQLID;
const BookingModel = require("../../models/booking");
const bookingType = require("../../types/booking").bookingType;
const { getErrorForCode, ERROR_CODES } = require("../../utils/errorCodes");

// Query
exports.BookingQuery = new GraphQLObjectType({
  name: "Query",
  fields: () => {
    return {
      bookings: {
        type: new GraphQLList(bookingType),
        resolve: async () => {
          try {
            const bookings = await BookingModel.find()
              .populate("user")
              .populate("booking")

            if (!bookings) {
              throw new Error(getErrorForCode(ERROR_CODES.EA3));
            }
            return bookings;
          } catch (error) {
            throw new Error(error);
          }
        },
      },
      getUserBookings: {
        type: new GraphQLList(bookingType),
        args: {
          userId: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        resolve: async (_, { userId }) => {
          try {
            const bookings = await BookingModel.find({ user: userId })
              .populate("user")
              .populate("booking")

            console.log({ bookings });
            if (!bookings) {
              throw new Error(getErrorForCode(ERROR_CODES.EA3));
            }
            return bookings;
          } catch (error) {
            throw new Error(error);
          }
        },
      },
      getBooking: {
        type: bookingType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        resolve: async (_, { id }) => {
          try {
            const booking = await BookingModel.findById(id)
              .populate("user")
              .populate("booking");
            if (!booking) {
              throw new Error(getErrorForCode(ERROR_CODES.EA2));
            }
            return booking;
          } catch (error) {
            throw new Error(error);
          }
        },
      },
    };
  },
});
