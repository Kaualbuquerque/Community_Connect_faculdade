import axios from "axios";
import { io } from 'socket.io-client';

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

export const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`); // seu backend NestJS