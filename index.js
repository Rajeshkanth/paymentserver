const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);

const websiteList = [
  "https://rajeshkanth.github.io/payment-app",
  "http://localhost:3000",

  "http://localhost:3001",
];

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

var val = 1;
const alertSockets = new Map();

io.on("connection", (socket) => {
  console.log(`user connected ${(val += 1)}`);
  socket.on("paymentPageConnected", (data) => {
    const { socketId, uniqueId } = data;
    console.log(data.NewReceiver, data.socketId, uniqueId);
    if (data.connected) {
      alertSockets.set(socketId, uniqueId, socket),
        io.emit("paymentConfirmAlert", {
          receivedValu: data.NewReceiver,
          UniqueId: uniqueId,
          SocketId: socketId,
        });
    }
  });
  socket.on("clicked", (data) => {
    console.log(data);
    const { UniqueId } = data;
    if (data.clicked) {
      const specificSocket = alertSockets.get(data.socketId);
      // if (specificSocket) {
      //   specificSocket.emit("success", true);
      // }
      io.to(UniqueId).emit("success", true);
    }
  });
  socket.on("canceled", (data) => {
    if (data.cancel) {
      const specificSocket = alertSockets.get(data.socketId); // Get the specific socket
      if (specificSocket) {
        specificSocket.emit("failed", true);
      }
      // io.to(data.socketId).emit("failed", true);
    }
  });
});

server.listen(3004, () => {
  console.log("server running on 3004");
});
