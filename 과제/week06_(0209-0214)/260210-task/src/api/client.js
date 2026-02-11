import axios from "axios";

const client = axios.create({
  baseURL: "http://54.180.25.65:3002/api", // .env 파일에서 불러온 값 사용
});

export default client;
