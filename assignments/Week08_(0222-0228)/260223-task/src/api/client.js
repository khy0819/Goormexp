import axios from "axios";

const client = axios.create({
  baseURL: "http://54.180.25.65:3002/api",
  timeout: 5000,
});

export default client;
