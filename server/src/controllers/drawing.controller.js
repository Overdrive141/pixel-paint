const WebSocket = require("ws");
const { generateRandomColor, broadcast } = require("../utils/index.js");

/**
 * @TODO: Username Management - Instead of checking from client's local storage, save assigned username to a http only cookie.
 * When user connects to the application, server should check the cookies for a session ID
 * If session id exists => Access username from req.session.username
 * else set the new username in the session => req.session.username
 */

// The canvasState will grow as more drawings/users join in so we can save older states to a cache db like Redis and load from both places when a user first joins
// This will improve performance and improve loading times
let canvasState = [];
let userCount = 0;
let userData = {};

const initWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  console.log("WS Server Started");

  wss.on("connection", (ws, req) => {
    let username;

    ws.on("message", (msg) => {
      let message;
      try {
        message = JSON.parse(msg);
        console.log("Message received: ", message);
      } catch (e) {
        console.error("Invalid message received:", e);
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid message received" })
        );
        // TODO: Throw valid error msg to client
        return;
      }

      const { type, data, user } = message;

      switch (type) {
        case "init": {
          console.log(user, userData);
          if (!user || !userData[user]) {
            userCount++;
            username = "User " + userCount;
          } else {
            username = user;
          }

          let userColor = generateRandomColor();
          userData[username] = { color: userColor };

          console.log(
            `${username} connected with IP: ${
              req.socket.remoteAddress
            }. Current userData: ${JSON.stringify(userData)}`
          );

          ws.send(
            JSON.stringify({
              type: "init",
              data: {
                username,
                color: userColor,
                canvasState,
                userList: userData,
              },
            })
          );

          broadcast(
            wss,
            JSON.stringify({ type: "updateUserList", data: userData }),
            ws
          );
          break;
        }

        case "draw": {
          canvasState.push(data);
          broadcast(wss, JSON.stringify({ type: "draw", data }), ws);
          break;
        }

        default:
          break;
      }
    });

    ws.on("close", () => {
      if (username) {
        // we are maintaining userdata and assigned colors. the line below can be removed if we want to assign new color/username on every connection
        // delete userData[username];

        console.log(`${username} disconnected.`);
        broadcast(
          wss,
          JSON.stringify({ type: "updateUserList", data: userData })
        );
      }
    });

    ws.on("error", (err) => {
      console.error(`WebSocket error for user ${username}:`, err);
    });
  });
};

module.exports = { initWebSocket };
