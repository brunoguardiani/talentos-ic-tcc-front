import axios from 'axios'

export const API_URL = process.env.REACT_APP_API || 'http://localhost:5000'
export const HOME_URL = process.env.HOME_URL || 'http://localhost:3000/'

const api = axios.create({
  baseURL: API_URL,
})

export default api
