import axios from 'axios'

// ✅ baseURL: Vite proxy를 통해 /api → http://54.180.25.65:3002/api 로 전달
const client = axios.create({
  baseURL: '/api',
})

export default client
