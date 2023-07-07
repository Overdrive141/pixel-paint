const WebSocket = require("ws");

const generateRandomColor = () => {
  // TODO: Add exception handling to catch error if the color fails to generate & assign #000000 as a default fallback

  const MAX_HEXCOLOR_VALUE_IN_DECIMALS = 16777215; // representation of ffffff in decimals

  const randColorValInDecimals = Math.floor(
    Math.random() * MAX_HEXCOLOR_VALUE_IN_DECIMALS
  ); // get a random whole number between #000000 & #ffffff in decimals

  return "#" + randColorValInDecimals.toString(16); // 16 gives us a hexcode value
};

const broadcast = (wss, data, ws) => {
  wss.clients.forEach((client) => {
    // if client is ready => send them the userlist of all connected users to the paint canvas
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      try {
        console.log("Broadcast Message Sent: ", data);
        client.send(data);
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }
  });
};

module.exports = { generateRandomColor, broadcast };
