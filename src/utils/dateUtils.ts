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
