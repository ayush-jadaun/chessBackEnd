const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const gameStatus = document.querySelector("h1");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";

  board.forEach((row, rowIndex) => {
    row.forEach((square, squareIndex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark",
        "flex",
        "items-center",
        "justify-center"
      );
      squareElement.dataset.row = rowIndex;
      squareElement.dataset.col = squareIndex;

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "text-white" : "text-black"
        );
        pieceElement.innerText = getPieceUnicode(square.type, square.color);

        // Only allow dragging if it's the player's piece and their turn
        pieceElement.draggable =
          (playerRole === "W" && square.color === "w") ||
          (playerRole === "B" &&
            square.color === "b" &&
            chess.turn() === square.color);

        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowIndex, col: squareIndex };
            e.dataTransfer.setData("text/plain", "");
            squareElement.classList.add("bg-blue-400", "bg-opacity-50");
          }
        });

        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
          clearHighlights();
        });

        squareElement.appendChild(pieceElement);
      }

      squareElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (draggedPiece) {
          squareElement.classList.add("bg-green-400", "bg-opacity-30");
        }
      });

      squareElement.addEventListener("dragleave", (e) => {
        squareElement.classList.remove("bg-green-400", "bg-opacity-30");
      });

      squareElement.addEventListener("drop", (e) => {
        e.preventDefault();
        squareElement.classList.remove("bg-green-400", "bg-opacity-30");

        if (draggedPiece) {
          const targetSquare = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };
          handleMove(sourceSquare, targetSquare);
        }
      });

      boardElement.appendChild(squareElement);
    });
  });

  updateGameStatus();
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q", // Always promote to queen for simplicity
  };

  // Emit move to server instead of making it directly
  socket.emit("move", move);
};

const getPieceUnicode = (type, color) => {
  // Using better Unicode chess pieces
  const pieceMap = {
    k: "♔",
    q: "♕",
    r: "♖",
    b: "♗",
    n: "♘",
    p: "♙",
    K: "♚",
    Q: "♛",
    R: "♜",
    B: "♝",
    N: "♞",
    P: "♟",
  };
  return pieceMap[color === "w" ? type : type.toUpperCase()];
};

const clearHighlights = () => {
  const squares = boardElement.querySelectorAll("div");
  squares.forEach((square) => {
    square.classList.remove(
      "bg-blue-400",
      "bg-opacity-50",
      "bg-green-400",
      "bg-opacity-30"
    );
  });
};

const updateGameStatus = () => {
  let status = `Chess Game`;

  if (playerRole) {
    status += ` - You are ${playerRole === "W" ? "White" : "Black"}`;
  } else {
    status += ` - Spectator Mode`;
  }

  if (chess.in_check()) {
    status += ` - Check!`;
  }

  if (chess.game_over()) {
    if (chess.in_checkmate()) {
      status += ` - Checkmate! ${
        chess.turn() === "w" ? "Black" : "White"
      } wins!`;
    } else {
      status += ` - Game Over! Draw`;
    }
  }

  gameStatus.textContent = status;
};

// Socket event handlers
socket.on("playerRole", (role) => {
  playerRole = role;
  renderBoard();
});

socket.on("spectatorRole", () => {
  playerRole = null;
  renderBoard();
});

socket.on("move", (moveData) => {
  chess.move(moveData);
  renderBoard();
});

socket.on("invalidMove", () => {
  renderBoard();
});

socket.on("gameOver", (winner) => {
  renderBoard();
});

// Initial rendering of the board
renderBoard();
