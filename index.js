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
io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("sendReceiverDetails", (data) => {
    io.emit("paymentConfirmAlert", { alert: data.NewReceiver });
    socket.on("confirmPayment", (data) => {
      if (data.pay) {
        io.emit("paymentSuccess", true);
      }
    });
  });
});

server.listen(3002, () => {
  console.log("server running on 3002");
});
