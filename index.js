const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);

const websiteList = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://95f8-115-245-170-206.ngrok-free.app/",
];

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
      io.emit("paymentConfirmAlert", {
        receivedValu: data.NewReceiver,
      });
    }
  });
  socket.on("clicked", (data) => {
    console.log(data);
    if (data.clicked) {
      io.emit("success", true);
    }
  });
});

server.listen(3004, () => {
  console.log("server running on 3004");
});
