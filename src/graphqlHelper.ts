import axios from "axios";
const BACKEND_URL = "http://localhost:4000";

export const sendQuery = (query: any): Promise<any> => {
  return axios.post(`${BACKEND_URL}/graphql?`, {
    query,
  });
};

export const getRooms = () => {
  return `{
    getRooms{
      id,
      name,
      description
    }
  }`;
};

// TODO Make it work with an user id which needs BE changes
export const getBookingsByUser = () => {
  return `{
    getBookings{
      id,
      participants,
      roomId,
      label,
      startDate,
      endDate
    }
  }`;
};

export const getUsers = () => {
  return `{
    participants{
      id,
      email,
      password,
      username
    }
  }`;
};

export const sendAuthorizedQuery = (
  query: string,
  token: string
): Promise<any> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.post(
    `${BACKEND_URL}/graphql?`,
    {
      query,
    },
    config
  );
};

export const registerMutation = (
  username: string,
  email: string,
  password: string,
) => `mutation {
  register(registerInput:{username:"${username}", email:"${email}", password:"${password}"})
    { id,
      email,
      username,
      token
    }}`;

export const loginMutation = (email: string, password: string) => {
  return `mutation{
    login(email: "${email}",
    password: "${password}",
    ){
      id,
      email,
      username,
      token,
    }
  }`;
};

export const bookingMutation = (
  roomId: String,
  label: String,
  startDate: String,
  endDate: String
) => {
  return `mutation{
    createBooking(
      roomId: "${roomId}",
      label: "${label}",
      startDate: "${startDate}",
      endDate: "${endDate}"
    ){
      id,
      participants, 
      roomId,
      label,
      startDate,
      endDate
    }
  }`;
};
