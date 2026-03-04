import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.PROD ? "http://54.180.25.65:3002/api" : "/api",
});

export default client;
