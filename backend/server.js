import app from "./src/app.js";
import { config } from "./src/config/config.js";
import { connectToDB } from "./src/config/db.js";
import http from 'http';
import { initSocket } from "./src/config/socket.config.js";

const server = http.createServer(app);

initSocket(server);

connectToDB();

// const dummyCartItem = {
//     cartItem: [
//     {
//     productName:"Linen pants",
//     color:"black",
//     size:"xl",
//     price:{
//         amount:599,
//         currency:"INR"
//     },
//     quautity:5
// },
// {
//     productName:"Linen Shirt",
//     color:"White",
//     size:"xxl",
//     price:{
//         amount:899,
//         currency:"INR"
//     },
//     quautity:10
// }
// ],
// totalAmount:{
//     amount:11985,
//     currency:"INR"
// }
// }

// await negotiateWithAI(dummyCartItem)

server.listen(config.PORT,()=>{
    console.log(`Server is running on port ${config.PORT}`);
})
