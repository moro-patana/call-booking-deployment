import React from "react";

export interface RoomType {
  id: string;
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
  username: string;
  email: string;
  password: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  usernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  emailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IEvent {
  [x: string]: any;
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  participants: string[];
}

export interface IResource {
  id: string | number;
  title: string;
  description: string;
}

export interface Booking {
  id: string | number;
  roomId: string;
  title: string;
  label: string;
  startDate: string;
  endDate: string;
  description: string;
  start: string;
  end: string;
  resourceId: string;
  participants: string[];
}

export interface NewBookingType {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  participants: string[];
}

export interface SelectDatePropsType {
  value: Date | string;
  setBooking: (value: IEvent | NewBookingType) => void;
  startTime: string;
  endTime: string;
}

export interface HandleSelectDatePropsType {
  value: any;
  booking: IEvent | NewBookingType;
  setBooking: (value: IEvent | NewBookingType) => void;
  startTime: string;
  endTime: string;
}

export type ErrorMessage = string | unknown | {} | null;
