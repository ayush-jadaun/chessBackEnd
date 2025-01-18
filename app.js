import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { Chess } from "chess.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const players = {
    white: null,
    black: null,
};

const game = new Chess();

app.set("view engine", "ejs");
app.use(express.static(path.join(process.cwd(), "public"))); // Use process.cwd() instead of __dirname for ES modules

app.get("/", (res) => {
    res.render("index", { title: "ChessGame" });
});

io.on("connection", function (socket) {
    console.log("A user connected");

    if (!players.white) {
        players.white = socket.id;
        socket.emit("playerRole", "W");
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit("playerRole", "B");
    } else {
        socket.emit("spectatorRole");
    }

    socket.on("disconnect", function () {
        console.log("A user disconnected");
        if (players.white === socket.id) {
            players.white = null;
        } else if (players.black === socket.id) {
            players.black = null;
        }
    });

    socket.on("move", function (move) {
      if (game.isGameOver()) {
        socket.emit("gameOver", game.turn() === "w" ? "black" : "white");
        return; 
      }

      try {
        const result = game.move(move);
        if (result) {
          io.emit("move", result);
          if (game.isGameOver()) {
            io.emit("gameOver", game.turn() === "w" ? "black" : "white");
            io.emit("boardState",game.fen())
          }
        } else {
          socket.emit("invalidMove", move);
        }
      } catch (error) {
        console.error("Invalid move:", error);
        socket.emit("invalidMove", move);
      }
    });

});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
