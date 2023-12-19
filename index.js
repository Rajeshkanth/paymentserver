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

var val = 0;
const socketRooms = new Map();

io.on("connection", (socket) => {
  console.log(`user connected: ${val++} , ${socket.id}`);

  socket.on("paymentPageConnected", (data) => {
    let socketId;
    const room = data.NewReceiver.tabId;
    console.log(data.NewReceiver);
    socketRooms.set(socket.id, room);
    for (const [key, value] of socketRooms.entries()) {
      if (value === room) {
        socketId = room;
        break;
      }
    }
    socket.join(room);
    if (data.connected) {
      io.emit("paymentConfirmAlert", {
        receivedValue: data.NewReceiver,
        UniqueId: room,
        socketRoom: socketId,
      });
    }
  });

  socket.on("join_success_room", (data) => {
    const socketID = data.SocketRoom;
    socket.join(socketID);
    console.log("room joined from success page", socketID);
  });

  socket.on("clicked", (data) => {
    const roomName = data.SocketRoom;
    console.log("tab id", data.tabId);
    console.log(`payment confirmed ${roomName}`);
    if (data.clicked) {
      io.to(data.tabId).emit("success", true); // Emit success to specific tabId
    }
  });

  socket.on("canceled", (data) => {
    if (data.cancel) {
      io.to(data.tabId).emit("failed", true);
    }
  });
});

server.listen(3009, () => {
  console.log("server running on 3004");
});
