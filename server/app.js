const express = require("express");
const path = require("path");
const http = require("http");
const drawingController = require("./src/controllers/drawing.controller");

const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const server = http.createServer(app);
drawingController.initWebSocket(server);

const PORT = process.env.SERVER_PORT || 8080;

server.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  }
  console.log("Server started on Port:", PORT);
});

// Todo: Handle uncaught exceptions and rejections at the process level to let it fail fast for auto restarts in prod.
