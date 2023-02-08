export const timeConverter = (time: number) => {
  return time < 10 ? `0${time}` : time;
};

export const dateStringConverter = (date: string) => {
  return new Date(Date.parse(date));
};

export const covertTONormalDate = (date: any) => {
  const newDate = new Date(date)
  return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
}

export const getSelectedTimeMinutes = (date: Date, params: number) => {
  return timeConverter(new Date(date?.setMinutes(params)).getMinutes());
};

export const newDateGenerator = (date: Date, time: string) => {
  const year = Number(date?.getFullYear());
  const month = Number(date?.getMonth());
  const day = Number(date?.getDate());
  const hour = Number(time.split(":")[0]);
  const minute = Number(time.split(":")[1]);
  return new Date(year, month, day, hour, minute, 0)
}