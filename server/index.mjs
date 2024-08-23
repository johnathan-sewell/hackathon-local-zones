import express from "express";
import { createServer } from "http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { Server } from "socket.io";

const PORT = 80;

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("ping", (msg) => {
    socket.emit("pong", { ...msg }); // sent to the client that sent the ping
  });

  // for debugging
  socket.onAny((eventName, ...args) => {
    console.log(eventName); // 'hello'
    console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
  });
});

const __dirname = dirname(fileURLToPath(import.meta.url));
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../client/index.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
