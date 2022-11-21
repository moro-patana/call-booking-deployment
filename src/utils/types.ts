export interface RoomType {
  id: string;
  name: string;
  description: string;
}

export interface UserType {
  id: string;
  email: string;
  password: string;
  username: string;
}

export interface BookingType {
  id: string;
  label: string;
  roomId: string;
  startDate: string | Date;
  endDate: string | Date;
  user: UserType;
}
