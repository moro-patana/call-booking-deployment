import { areIntervalsOverlapping } from "date-fns";
import { changeDateTime, getValidTime } from "./dateUtils";
import { HandleSelectDatePropsType, IEvent, RoomType } from "./types";

export const getAvailableRoomsNote = (roomsCount: number | null) => {
  if (roomsCount === 1) {
    return `There is ${roomsCount} available room`;
  } else {
    return `There are ${roomsCount} available rooms`;
  }
}

export const getAvailableRooms = ({ events, selectedRoom, start, newStartDate, newEndDate, rooms }:
  { events: IEvent[], selectedRoom: string, start: Date, newStartDate: Date, newEndDate: Date, rooms: RoomType[] }) => {
  const selectedTimeSlotBooking = events.filter((booking: IEvent) => {
    const startDate = booking.start;
    return (
      startDate.getDate() === start.getDate() &&
      startDate.getMonth() === start.getMonth() &&
      startDate.getFullYear() === start.getFullYear()
    );
  });

  if (getValidTime(newStartDate, newEndDate)) {
    const bookingOnTheSameTimeSlot = selectedTimeSlotBooking.filter(
      (booking: IEvent) =>
        areIntervalsOverlapping(
          { start: newStartDate, end: newEndDate },
          { start: booking?.start, end: booking?.end }
        )
    );

    const bookedRoomsId = bookingOnTheSameTimeSlot.map((booking: IEvent) => booking?.resourceId);

    const availableRooms = rooms?.filter((room: RoomType) => selectedRoom === room?.id || !bookedRoomsId.includes(room?.id));

    return availableRooms;
  }
  return [];
}

export const handleSelectDate = (
  {
    value,
    booking,
    setBooking,
    startTime,
    endTime
  }: HandleSelectDatePropsType
) => {
  changeDateTime(new Date(value), startTime);
  setBooking({
    ...booking,
    start: changeDateTime(new Date(value), startTime),
    end: changeDateTime(new Date(value), endTime),
  });
};
