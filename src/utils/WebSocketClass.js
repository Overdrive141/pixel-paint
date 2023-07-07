/**
 * Deprecated
 * Not using this class anymore.
 */

class WebSocketSingleton {
  // TODO: Handle Reconnections and connection through username

  // adding limit on maximum retry attempts if conn is lost
  static MAX_RETRIES = 5;
  static EXP_BACKOFF_INTERVAL_IN_SECS = 1000;

  // Initialise with username if present in browser's local storage
  // This case only happens when the current client previously connected to the server
  // If the client does not send a username to the server then the server randomly assigns a new username to the client which is then saved on to the client's browser storage
  constructor() {
    if (!WebSocketSingleton.instance) {
      this._ws = null;
      this._retries = 0; // initialise the retry count
      WebSocketSingleton.instance = this;
    }

    return WebSocketSingleton.instance;
  }

  getInstance(username) {
    if (!this._ws) {
      this._ws = new WebSocket("ws://10.0.0.111:8080");

      console.log("Created");

      // Connection opened
      this._ws.onopen = () => {
        console.log("WebSocket connection opened");
        this._retries = 0; // Reset retry count
        // this._ws.send(JSON.stringify({ type: "init", user: username }));
      };

      this._ws.onclose = (e) => {
        console.log("WebSocket closed, retrying connection...");
        if (!e.wasClean && this._retries < WebSocketSingleton.MAX_RETRIES) {
          // Only reconnect if the maximum number of attempts has not been reached
          this.reconnect();
        } else {
          console.log("Max reconnect attempts reached.");
        }
      };

      this._ws.onerror = (err) => {
        console.error(`WebSocket error: ${err} ---- Retrying...`);
      };
    }

    return WebSocketSingleton.socket;
  }

  reconnect() {
    // exponential backoff => make it wait between each retry to allow server time to recover/get back up and reduce load on network
    setTimeout(() => {
      this._retries++;
      this._ws = null;
      this.getInstance();
    }, Math.min(WebSocketSingleton.EXP_BACKOFF_INTERVAL_IN_SECS * this._retries, 1000));
    console.log("reconnecting", WebSocketSingleton.attempts);
  }
}

export default WebSocketSingleton;
