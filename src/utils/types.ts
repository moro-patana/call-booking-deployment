import React from "react";

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

export interface UserType {
  username: string
  email: string
  password: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  usernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  emailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  passwordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}