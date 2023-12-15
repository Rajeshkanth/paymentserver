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

io.on("connection", (socket) => {
  const { source, from } = socket.handshake.query;
  const socketId = `${socket.id} - ${source}- ${from} `;
  console.log(`user connected: ${val++} :${socketId}`);

  // Join the room corresponding to the tab identifier
  io.emit("uniqueID", { Socket: socketId });
  socket.on("paymentPageConnected", (data) => {
    console.log(data.NewReceiver);
    if (data.connected) {
      io.emit("paymentConfirmAlert", {
        receivedValue: data.NewReceiver,
        UniqueId: data.uniqueID,
      });
    }
  });

  socket.on("clicked", (data) => {
    console.log(`payment confirmed ${data.UniqueId}`);
    if (data.clicked) {
      io.emit("success", { Success: true, UniqueId: data.UniqueId });
    }
  });

  socket.on("canceled", (data) => {
    if (data.cancel) {
      io.emit("failed", true);
    }
  });
});

server.listen(3004, () => {
  console.log("server running on 3004");
});
