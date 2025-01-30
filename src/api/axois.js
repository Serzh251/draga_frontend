import axios from 'axios';
import config from "../config";

const DOMAIN = config.API_URL;

export default axios.create({
  baseURL: DOMAIN
});

export const axiosPrivate = axios.create({
  baseURL: DOMAIN,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
});