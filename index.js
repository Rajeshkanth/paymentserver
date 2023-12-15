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
  // const { source } = socket.handshake.query;
  console.log(`user connected: ${val++} `);
  socket.userRooms = [];

  // Join the room corresponding to the tab identifier

  socket.on("paymentPageConnected", (data) => {
    // socket.join(source);
    const room = data.Room;

    // socket.userRooms.push(room);
    // console.log(room);
    console.log(data.NewReceiver, room);
    if (data.connected) {
      io.emit("paymentConfirmAlert", {
        receivedValue: data.NewReceiver,
        Room: room,
      });
    }
  });

  socket.on("clicked", (data) => {
    const room = data.Room;
    socket.join(room);
    console.log(`payment confirmed ${room}`);
    if (data.clicked) {
      io.to(room).emit("success", { Success: true, Room: room });
    }
    socket.leave(room);
  });

  socket.on("canceled", (data) => {
    if (data.cancel) {
      io.to(room).emit("failed", true);
    }
  });

  // Add error handling for each event if needed
  // socket.onAny((event, ...args) => {
  //   console.log(`Received event: ${event}`);
  //   // Handle any errors or debug logs here
  // });
});

server.listen(3004, () => {
  console.log("server running on 3004");
});
