import express from "express";
import { Server } from "socket.io";

import http from "http";
import path from "path";
import { Chess } from "chess.js";

const app = express();
const server = http.createServer(app);

// Correct the instantiation of the Server
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(process.cwd(), "public"))); // Use process.cwd() instead of __dirname for ES modules

app.get("/", (req, res) => {
  res.render("index", { title: "ChessGame" });
});

// Handle the socket connection
io.on("connection", function (socket) {
  console.log("A user connected");

  // You can handle socket events here
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
