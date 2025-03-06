import axios from 'axios';
import configApi from './config-api';

const DOMAIN = configApi.API_URL;
export default axios.create({
  baseURL: DOMAIN,
});

export const axiosPrivate = axios.create({
  baseURL: DOMAIN,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
