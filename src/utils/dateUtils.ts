import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfWeek,
  startOfWeek,
} from "date-fns";

export const timeConverter = (time: number) => {
  return time < 10 ? `0${time}` : time;
};

export const dateStringConverter = (date: string) => {
  return new Date(Date.parse(date));
};

export const covertTONormalDate = (date: any) => {
  const newDate = new Date(date);
  return `${newDate.getDate()}/${
    newDate.getMonth() + 1
  }/${newDate.getFullYear()}`;
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

export const getWeekDays = (selectedDate: Date) => {
  const startDay = getCurrentDay(selectedDate);
  const endDay = getEndingDay(selectedDate);
  const weekDays = eachDayOfInterval({ start: startDay, end: endDay });
  return weekDays;
};

export const getAvailableHours = (selectedDate: Date) => {
  const startHour = new Date().setHours(selectedDate.getHours() - 2);
  const endHour = new Date().setHours(selectedDate.getHours() + 6);
  const availableHours = eachHourOfInterval({
    start: startHour,
    end: endHour,
  });
  return availableHours;
};

export const changeDateTime = (date: Date, time: string) => {
  const timeElement = time.split(":");
  const modifiedHour = new Date(date.setHours(Number(timeElement[0])));
  return new Date(modifiedHour.setMinutes(Number(timeElement[1])));
};

export const isValidTime = (startDate: Date, endDate: Date) =>
  startDate.getTime() < endDate.getTime();
