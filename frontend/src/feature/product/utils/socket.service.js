import { io } from "socket.io-client";

const socket = io("https://snitch-w2kp.onrender.com", { withCredentials: true });
// const socket = io("http://localhost:4000", { withCredentials: true });


export default socket;