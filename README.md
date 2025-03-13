# Chess BackEnd

## Description

Chess BackEnd is the backend implementation for a chess game application. This repository features a RESTful API built with Node.js and Express, while Socket.IO facilitates real-time communication between players. The chess game logic is managed by the `chessGame.js` library, and EJS is used for server-side templating. This implementation provides a solid foundation for creating interactive and real-time chess experiences.

## Technologies Used

- **Node.js**
- **Express**
- **Socket.IO**
- **chess.js**
- **EJS**
- **nodemon** (for development)

## Dependencies

- `chess.js`: "^1.0.0"
- `ejs`: "^3.1.10"
- `express`: "^4.21.2"
- `nodemon`: "^3.1.9"
- `socket.io`: "^4.8.1"

## Features

- **Real-time Game Play:**  
  Leverages Socket.IO for live communication between clients, enabling real-time chess moves and game status updates.

- **Robust Game Logic:**  
  Utilizes chess.js to handle game rules, move validation, check, checkmate, and stalemate conditions.

- **Server-Side Rendering:**  
  EJS is used to dynamically render HTML views, simplifying the integration of game logic with the user interface.

- **Developer Friendly:**  
  Integrated with nodemon for automatic server restarts during development, speeding up the feedback loop.

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ayush-jadaun/chessBackEnd.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd chessBackEnd
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Start the Server**

   ```bash
   npm run start
   ```

   The server should now be running. By default, it listens on port 3000 (you can change this in your configuration).

## Project Structure

```
chessBackEnd/
├── node_modules/
├── public/
│   ├── css/
│   └── js/chessGame.js
│   
├── views/
│   └── index.ejs
├── package.json
├── package-lock.json
└── app.js
```

- **public/**: Contains static assets like CSS, JavaScript, and image files.
- **views/**: Contains EJS templates for the application views.
- **app.js**: The main entry point of the application where the Express server, Socket.IO, and chess.js integrations are configured.

## Usage

After starting the server, open your browser and navigate to:

```
http://localhost:3000
```

You will be presented with the landing page. From here, you can start a new game, or continue an existing one. All game moves are processed by the backend, with real-time updates delivered to connected clients via sockets.

## Customization

- **Changing the Port:**  
  You can change the server port by modifying the code in `app.js` or setting an environment variable (e.g., `PORT=5000`).

- **Templating:**  
  Update or add new EJS templates in the `views/` directory to customize the user interface.

- **Static Assets:**  
  Place your CSS, JavaScript, or images in the `public/` directory and reference them in your EJS files.

## Troubleshooting

- **Socket.IO Issues:**  
  Ensure that your clients are able to reach the server and that firewalls or proxies are not blocking the WebSocket connections.

- **Dependency Conflicts:**  
  If you encounter issues with dependencies, try deleting the `node_modules` folder and running `npm install` again.

- **Restarting the Server:**  
  When making changes during development, nodemon will automatically restart the server. If you encounter issues related to caching, consider manually restarting the server.

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push your changes (`git push origin feature/YourFeature`).
5. Open a pull request detailing your changes.

Happy coding!
