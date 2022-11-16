export interface RoomType {
  id: string;
  name: string;
  description: string;
}

export interface BookingType {
  endDate: string;
  id: string;
  label: string;
  roomId: string;
  startDate: string;
}

export interface UserType {
  id: string;
  email: string;
  password: string;
  username: string;
}
