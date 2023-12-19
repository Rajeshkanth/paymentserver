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
let socketId;

io.on("connection", (socket) => {
  // const { source, from } = socket.handshake.query;
  // const socketId = `${socket.id} - ${source}- ${from} `;
  console.log(`user connected: ${val++} , ${socket.id}`);

  // Join the room corresponding to the tab identifier

  // socket.on("join_room", (data) => {
  //   console.log(`user connected ${socket.id}, in room ${data} `);
  //   socketRooms.set(socket.id, data);
  //   const roomName = data;
  //   console.log("room name from join room", roomName);
  //   socket.join(roomName);
  //   io.emit("room_name", roomName);
  // });

  socket.on("paymentPageConnected", (data) => {
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
      });
    }
  });

  socket.on("join_success_room", (data) => {
    // const room = socketRooms.get(socket.id);

    console.log("room joined from success page");
    socket.join(socketId);
  });
  console.log("room id from outside,", socketRooms);

  socket.on("clicked", (data) => {
    const roomName = socketId;
    console.log(`payment confirmed ${roomName}`);
    if (data.clicked) {
      io.to(roomName).emit("success", true);
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

// const express = require("express");
// const app = express();
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// app.use(cors());
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// var val = 0;
// const tabRooms = {};

// io.on("connection", (socket) => {
//   console.log(`user connected: ${val++} , ${socket.id}`);

//   socket.on("paymentPageConnected", (data) => {
//     const room = data.Uid;
//     const TabId = data.tabId;

//     console.log(TabId);
//     console.log(data.NewReceiver);

//     if (!tabRooms[TabId]) {
//       tabRooms[TabId] = [];
//     }

//     tabRooms[TabId].push(room);
//     socket.join(room);
//     console.log(tabRooms[TabId]);

//     if (data.connected) {
//       io.emit("paymentConfirmAlert", {
//         receivedValue: data.NewReceiver,
//         UniqueId: room,
//         tabId: TabId,
//       });
//     }
//   });

//   socket.on("join_success_room", (data) => {
//     const tabId = data.tabId;
//     const rooms = tabRooms[tabId] || [];

//     rooms.forEach((room) => {
//       socket.join(room);
//       console.log("room joined from success page", room);
//     });
//   });

//   socket.on("clicked", (data) => {
//     const tabId = data.tabId;
//     const rooms = tabRooms[tabId] || [];
//     rooms.forEach((roomName) => {
//       console.log(`payment confirmed ${roomName}`);
//       if (data.clicked) {
//         io.to(roomName).emit("success", true);
//       }
//     });
//   });

//   socket.on("canceled", (data) => {
//     if (data.cancel) {
//       io.emit("failed", true);
//     }
//   });
// });

// server.listen(3004, () => {
//   console.log("server running on 3004");
// });
