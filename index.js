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
    console.log(data.newReceiver);
    if (data.connected) {
      io.emit("paymentConfirmAlert", { receivedValu: data.newReceiver });
      //   io.emit("loading", { isLoading: true });
    }
  });
});

server.listen(3002, () => {
  console.log("server running on 3002");
});
