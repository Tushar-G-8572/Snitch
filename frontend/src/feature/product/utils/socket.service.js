import { io } from "socket.io-client";

const socket = io("https://snitch-w2kp.onrender.com", { withCredentials: true });


export default socket;