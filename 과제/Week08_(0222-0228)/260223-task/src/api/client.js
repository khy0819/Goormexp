import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.DEV
    ? "/api" // 개발 환경: Vite proxy 사용
    : "http://54.180.25.65:3002/api", // 프로덕션: 직접 서버로
});

export default client;
