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

const chess = new Chess();

app.set("view engine", "ejs");
app.use(express.static(path.join(process.cwd(), "public")));

// Serve the chess game page
app.get("/", (req, res) => {
  res.render("index", { title: "ChessGame" });
});

// Socket.io connection and game logic
io.on("connection", function (socket) {
  console.log("A user connected", socket.id);

  // Assign player roles (white or black)
  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "W");
    io.emit("updatePlayers", players);
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "B");
    io.emit("updatePlayers", players);
  } else {
    socket.emit("spectatorRole");
  }

  // Handle player disconnections
  socket.on("disconnect", function () {
    console.log("A user disconnected", socket.id);
    if (players.white === socket.id) {
      players.white = null;
    } else if (players.black === socket.id) {
      players.black = null;
    }
    io.emit("updatePlayers", players);
  });

  // Handle chess move events
  socket.on("move", function (move) {
    try {
      // Check if game is already over
      if (chess.isGameOver()) {
        socket.emit("gameOver", chess.turn() === "w" ? "black" : "white");
        return;
      }

      // Attempt to make the move
      const result = chess.move(move);

      if (result) {
        io.emit("move", result); // Notify all clients of the move

        // Check game state after move
        if (chess.isGameOver()) {
          let gameResult;
          if (chess.isCheckmate()) {
            gameResult = chess.turn() === "w" ? "black" : "white";
          } else {
            gameResult = "draw";
          }
          io.emit("gameOver", gameResult);
        } else if (chess.isCheck()) {
          io.emit("check");
        }

        io.emit("boardState", chess.fen()); // Send the current board state
      } else {
        socket.emit("invalidMove", move);
      }
    } catch (error) {
      console.error("Move error:", error);
      socket.emit("invalidMove", move);
    }
  });

  // Handle resignation
  socket.on("resign", function () {
    const winner = socket.id === players.white ? "black" : "white";
    io.emit("gameOver", winner);
  });

  // Handle draw offers
  socket.on("offerDraw", function () {
    const opponent =
      socket.id === players.white ? players.black : players.white;
    io.to(opponent).emit("drawOffer");
  });

  socket.on("acceptDraw", function () {
    io.emit("gameOver", "draw");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
