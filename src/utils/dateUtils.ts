import { areIntervalsOverlapping, endOfWeek, format, startOfWeek } from "date-fns";
import { IEvent, NewBookingType } from "./types";

export const timeConverter = (time: number) => {
  return time < 10 ? `0${time}` : time;
};

export const dateStringConverter = (date: string) => {
  return new Date(Date.parse(date));
};

export const getSelectedTimeMinutes = (date: Date, params: number) => {
  return timeConverter(new Date(date?.setMinutes(params)).getMinutes());
};

export const newDateGenerator = (date: Date, time: string) => {
  const year = Number(date?.getFullYear());
  const month = Number(date?.getMonth());
  const day = Number(date?.getDate());
  const hour = Number(time.split(":")[0]);
  const minute = Number(time.split(":")[1]);
  return new Date(year, month, day, hour, minute, 0);
};

export const getCurrentDay = (selectedDate: Date) => {
  return startOfWeek(selectedDate, { weekStartsOn: 1 });
};

export const getEndingDay = (selectedDate: Date) => {
  return endOfWeek(selectedDate, { weekStartsOn: 1 });
};

export const changeDateTime = (date: Date, time: string) => {
  const timeElement = time.split(":");
  const modifiedHour = new Date(date.setHours(Number(timeElement[0])));
  return new Date(modifiedHour.setMinutes(Number(timeElement[1])));
};

export const getValidTime = (startDate: Date, endDate: Date) =>
  startDate.getTime() < endDate.getTime() && startDate.getTime() !== endDate.getTime();

export const isTimeOverlapping = (
  booking: IEvent | NewBookingType,
  startTime: Date,
  endTime: Date,
  events: IEvent[]
) => {
  const { resourceId, start } = booking;
  const bookingOnTheSelectedDay = events.filter((booking: IEvent) => {
    const startDate = booking.start;
    return (
      booking.resourceId === resourceId &&
      startDate.getDate() === start.getDate() &&
      startDate.getMonth() === start.getMonth() &&
      startDate.getFullYear() === start.getFullYear()
    );
  });

  if (getValidTime(startTime, endTime)) {
    const bookingOnTheSameHour = bookingOnTheSelectedDay.filter(
      (booking: IEvent) =>
        areIntervalsOverlapping(
          { start: startTime, end: endTime },
          { start: booking.start, end: booking.end }
        )
    );
    return bookingOnTheSameHour.length > 0;
  }
};

export const formatTime = (date: Date) => {
  const time = date && format(date, "h:mm a");
  const newTime = time.split(" ");
  const formatedTime = newTime.includes("AM") ? newTime.map(t => {
    if (t !== "AM") {
      const morningTime = t.split(":");
      const amTime = `${morningTime[0] === "12" ? "00" : morningTime[0]}:${morningTime[1]}`;
      return amTime;
    }
    return t;
  }) : newTime;
  return formatedTime.join(" ");
};
