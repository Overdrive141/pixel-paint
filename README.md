# Pixel Paint Solution Information

> By: Farhan Hammad

This portion of the documentation explains the features of the implemented solution for the problem. 

## How to Run?

1. Clone the repository:
   ```
   git clone https://github.com/Overdrive141/pixel-paint
   ```
2. Install all the dependencies. Both server and client are using the same package.json
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run start:server
   ```
4. Open a separate terminal to start the client:
   ```
   npm run start
   ```

## Information

- The default port for the server has been set to `8080`
- **Web Sockets**: The server and client communicate between each other through WebSockets. On the server side, the library is called `ws` and on the client side, I am using `react-use-websockets` that takes care of most of the exception handling and provides mechanisms for retries, exponential backoff and some exception handling.
- Initially, I was using the native WebSockets API by creating a Singleton Class found in `utils/` but due to lack of time on my end, I decided to use this library instead to work on the more important features.

## Future Work

 I have added `TODO` comments throughout the application on most files to show problems for edge cases, user experience, responsiveness issues and some exceptions that are not handled.

# Flow

 1. When the client connects to the server, the client first checks the localStorage for a username (if it previously connected to the server). And if it finds it then it sends it to the server using a message of `type: init`. This ensures that the client's username remains the same whenever they connect to this server (unless server restarts)
 2. The server then reads this message, updates `usercount`, generates a color for this client and updates the global `userList` with the username and the user color.
 3. Server responds back to the client with the message `type: init` with client's username (new or old), color, the canvasState (stores the x, y and color for each pixel) and the updated user list.
 4. The client updates its canvas using the data sent from the server and see the current connected users.
 5. Whenever a client draws on the canvas, a message `type: draw` is sent to the server with the (x, y, color). `x` and `y` here are the coordinates of the mouse position relative to the canvas bounds, not the screen or the window.
 6. The server consumes this message and broadcasts a message to all connected clients with the updated canvasList by sending a message `type: draw` that uses the same drawPixel() function to update canvas for all connected clients
 7. The last message type is `type: updateUserList` that is a broadcast message sent by server to all connected clients whenever a new user joins/connects to the server. All clients (except the user itself) consume this message by updating their user list.

---

# 3dverse web dev challenge: Pixel Paint (Original Readme)
 

## What to implement

You will create a collaborative paint app (similar to https://pixelplace.io/). In short:

- You arrive on a page with a canvas.
- You pick a color (or get assigned one randomly), and can click or drag around the page to draw with your color.
- You see the new drawings of other connected users in real time.
- Next to the canvas, you see an indication of your currently assigned color, and you also see a list of currently connected users with their names and respective colors.
- Users can have random names generated on the fly (User 1, User 2 for example), but the same user should have the same name across different clients.
- New users arriving on the page should see previous drawings.

## Additional completion criteria 

- All canvas rendering should be done with the browser canvas API.
- Implement a websocket server alongside the express server for handling real-time messages.
- Modifying the REST routes in the express server is not required.
- It is *not* necessary to persist the canvas content after restarting the server. You can restart with a blank canvas.
