import { useEffect, useState, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import "./App.css";

import DrawingCanvas from "./components/DrawingCanvas";
import UserInfo from "./components/UserInfo";
import { CANVAS_CONSTANTS, SOCKET_API_URL } from "./constants";
import UserList from "./components/UserList";

/**
 * TO make the message communication between server and client more robust and easy on the DX, I would have wanted to use TypeScript with predefined msg types but due to lack of time I had to settle in for JS and boilerplate
 */

function App() {
  // @TODO: Move this logic over to be handled with server session & http only cookies
  const username = useRef(localStorage.getItem("username"));
  const canvasRef = useRef(null);

  const [userList, setUserList] = useState({});
  const [color, setColor] = useState("#000000"); // defaults to black

  // Define the WebSocket connection URL and options
  const socketUrl = SOCKET_API_URL;
  const options = {
    shouldReconnect: (closeEvent) => true, // Will attempt to reconnect on all close events
    reconnectAttempts: 10, // Maximum number of reconnection attempts
    reconnectInterval: 3000, // Time to wait (in ms) before attempting to reconnect
    onOpen: (e) => console.log("Connection opened.", e),
    onError: (event) => console.error(`WebSocket error: ${event.message}`),
  };

  // Set up the WebSocket connection
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
    options
  );

  useEffect(() => {
    // send a msg when the client is ready and the username has been fetched
    console.log(readyState);
    if (readyState === ReadyState.OPEN && username.current) {
      sendMessage(JSON.stringify({ type: "init", user: username.current }));
    }
  }, [readyState, sendMessage]);

  // Handle incoming messages
  useEffect(() => {
    if (lastMessage !== null) {
      const { type, data } = JSON.parse(lastMessage.data);

      switch (type) {
        case "init":
          username.current = data.username;
          setColor(data.color);
          localStorage.setItem("username", data.username);
          data.canvasState.forEach(drawPixel);
          setUserList(data.userList);
          break;
        case "draw":
          drawPixel(data);
          break;
        case "updateUserList":
          console.log(data);
          setUserList(data);
          break;
        default:
          console.error("Unknown message type received:", type);
      }
    }
  }, [lastMessage]);

  // TODO: Move this to helpers folder where this function and other functions from DrawingCanvas component can be defined to organize them better.
  const drawPixel = ({ x, y, color }) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.lineWidth = CANVAS_CONSTANTS.LINE_WIDTH;
      ctx.lineCap = CANVAS_CONSTANTS.LINE_CAP;
      ctx.strokeStyle = color;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  // TODO: Add Loading Overlay until socket connects
  // TODO: Show toast during connection state, new msg received, and on successful connection to socket
  // TODO: Show alert or error toast whenever server loses connection & show user a toast in loading state to show that we are reattempting to connect
  // TODO: Add filter on whole screen or a Toast to notify user that connection is happening or inform about state of the websocket connection

  // TODO Feature: Show cursors of other connected users on the canvas and a tooltip showing their username (like Figma)

  return (
    <div className="app flex flex-col h-screen">
      <header className="p-5 text-black flex items-center justify-between">
        <h1 className="text-3xl">3D Verse Challenge</h1>
      </header>
      <main className="p-5 flex-wrap gap-4 flex-grow flex flex-col items-stretch">
        <div className=" flex flex-col items-start justify-center">
          {username.current && color && (
            <UserInfo username={username.current} color={color} />
          )}
        </div>
        <div className="flex space-between justify-between">
          <div className={`border-black border relative inline-flex`}>
            <DrawingCanvas
              color={color}
              ref={canvasRef}
              drawPixel={drawPixel}
              sendMessage={sendMessage}
            />
          </div>
          <div className="bg-gray-100 p-5 flex flex-col">
            <UserList data={userList} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
