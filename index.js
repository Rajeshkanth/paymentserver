const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

var val = 1;
io.on("connection", (socket) => {
  console.log(`user connected ${(val += 1)}`);
  socket.on("paymentPageConnected", (data) => {
    console.log(data.NewReceiver);
    if (data.connected) {
      io.emit("paymentConfirmAlert", { receivedValu: data.NewReceiver });
      
      //   io.emit("loading", { isLoading: true });
      socket.on("clicked",(data)=>{
        if(data.clickked){
          io.emit("success",{success:true})
        }
      })
    }
  });

 
});

server.listen(3004, () => {
  console.log("server running on 3002");
});
