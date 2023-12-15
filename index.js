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
  console.log(`user connected ${(val += 1)}`);
  socket.on("paymentPageConnected", (data) => {
    console.log("from : " + val, +" " + data.NewReceiver);
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
  socket.on("canceled", (data) => {
    if (data.cancel) {
      io.emit("failed", true);
    }
  });
});

server.listen(3004, () => {
  console.log("server running on 3004");
});
