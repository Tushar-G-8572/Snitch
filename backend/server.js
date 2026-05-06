import app from "./src/app.js";
import { config } from "./src/config/config.js";
import { connectToDB } from "./src/config/db.js";
import http from 'http';
import { initSocket } from "./src/config/socket.config.js";

const server = http.createServer(app);

initSocket(server);

connectToDB();

server.listen(config.PORT,()=>{
    console.log(`Server is running on port ${config.PORT}`);
})
