import React from "react";

export interface RoomType {
  id: any;
  name: string;
  description: string;
}

export interface UserBookingType {
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
  user: UserBookingType;
}

export interface UserType {
  username: string
  email: string
  password: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  usernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  emailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  passwordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface IEvent {
  id: number | string;
  title: string;
  start: Date | string;
  end: Date | string;
  resourceId: string;
}

export interface IResource {
  id: string | number;
  title: string;
  description: string;
}

export type Booking = {
  id: string;
  roomId: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  start: string;
  end: string;
  resourceId: string
}