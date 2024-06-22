const socketIo = require("socket.io");

const server = require("node:http").createServer((request, response) => {
  response.writeHead(204, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "OPTIONS, POST, GET",
  });
  response.end("hey there!");
});

const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: false,
  },
});

io.on("connection", (socket) => {
  console.log("connection", socket.id);
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("disconnect", () => {
      console.log("disconnected!", roomId, userId);
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

const startServer = () => {
  const { address, port } = server.address();
  console.log(`app running at ${address}:${port}`);
};

server.listen(process.env.PORT || 3000, startServer);
