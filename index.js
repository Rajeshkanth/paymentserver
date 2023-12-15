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
  const { source } = socket.handshake.query;
  console.log(`user connected ${(val += 1)} ${source}`);
  socket.on("paymentPageConnected", (data) => {
    console.log(data.NewReceiver, +" " + source);
    const id = data.ID;
    socket.join(id);
    if (data.connected) {
      io.to(id).emit("paymentConfirmAlert", {
        receivedValu: data.NewReceiver,
      });
    }
  });
  socket.on("clicked", (data) => {
    console.log(data);

    if (data.clicked) {
      io.to(source).emit("success", true);
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
