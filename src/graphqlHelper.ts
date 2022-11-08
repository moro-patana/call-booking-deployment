import axios from "axios";
const BACKEND_URL = "http://localhost:4000";

export const sendQuery = (query: any): Promise<any> => {
  return axios.post(`${BACKEND_URL}/graphql?`, {
    query,
  });
};

export const getRooms = () => {
  return `{
      rooms{
      id,
      name,
      description
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
  password: string,
  email: string
) => `mutation{
  register(registerInput:{username:"${username}",password:"${password}",email:"${email}"})
    { id,
      createdAt,
      email,
      username,
      token
    }}`;

export const loginMutation = (username: string, password: string) => {
  return `mutation{
    login(username:"${username}",
    password:"${password}",
    ){
      id,
      email,
      username,
      token,
    }
  }`;
};
