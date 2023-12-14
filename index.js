const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);

const websiteList=["http://localhost:3001","http://localhost:3002"]

const io = new Server(server, {
  cors: {
    origin: websiteList,
  },
});

var val = 1;
io.on("connection", (socket) => {
  console.log(`user connected ${(val += 1)}`);
  socket.on("paymentPageConnected", (data) => {
    console.log(data.NewReceiver);
    if (data.connected) {
      socket.broadcast.emit("paymentConfirmAlert", { receivedValu: data.NewReceiver });
      
      //   io.emit("loading", { isLoading: true });
      socket.on("clicked",(data)=>{
        console.log("from payment");
        if(data.clicked){
          socket.broadcast.emit("success",{success:true})
        }
      })
    }
  });

 
});

server.listen(3004, () => {
  console.log("server running on 3002");
});
