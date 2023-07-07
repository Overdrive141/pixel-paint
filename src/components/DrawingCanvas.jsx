import React, { useEffect, useState } from "react";
import { CANVAS_CONSTANTS } from "../constants";

/**
 * Using refs for ctx & boundsRef to prevent rerenders and to prevent from defining logic within the useEffect as these values need to be read and updated frequently as the mouse is moving along
 * Prevention of expensive computation.
 *
 * canvasBoundRef => Used to get the bounds of the canvas element (depends on window size) so that the drawing happens within those bounds. These bounds change on window sizes
 */

/**
 * TODO: Resize the canvas to fit its container by setting canvas dimensions through refs
 * and make it responsive by normalizing pixel positions & transform it according to canvas size on screen
 *
 *  Right now it works fine for a single user or for users with exactly the same screen size. (1920x1080)
 * However, if someone is using a smaller or larger screen, the drawing will not match between different devices.
 */

const DrawingCanvas = React.forwardRef(
  ({ color, sendMessage, drawPixel }, canvasRef) => {
    const [painting, setPainting] = useState(false);

    // to support for both mobile touchscreens & mice
    const getCoordinates = (event) => {
      const { clientX, clientY } =
        "touches" in event ? event.touches[0] : event;

      // Now 'x' and 'y' are the mouse position relative to the top-left corner of the canvas
      const rect = canvasRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      return { x, y };
    };

    useEffect(() => {
      // wait until canvas is mounted
      if (!canvasRef) {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const start = (e) => {
        e.preventDefault();
        ctx.beginPath();
        setPainting(true);
        drawHandler(e);
      };

      const stop = () => {
        setPainting(false);
      };

      const drawHandler = (e) => {
        if (!painting) return;
        e.preventDefault();
        const { x: clientX, y: clientY } = getCoordinates(e);

        drawPixel({ x: clientX, y: clientY, color });

        sendMessage(
          JSON.stringify({
            type: "draw",
            data: { x: clientX, y: clientY, color },
          })
        );
      };

      canvas.addEventListener("mousedown", start);
      canvas.addEventListener("mouseup", stop);
      canvas.addEventListener("mousemove", drawHandler);
      canvas.addEventListener("touchstart", start);
      canvas.addEventListener("touchend", stop);
      canvas.addEventListener("touchmove", drawHandler);

      return () => {
        canvas.removeEventListener("mousedown", start);
        canvas.removeEventListener("mouseup", stop);
        canvas.removeEventListener("mousemove", drawHandler);
        canvas.removeEventListener("touchstart", start);
        canvas.removeEventListener("touchend", stop);
        canvas.removeEventListener("touchmove", drawHandler);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color, sendMessage, painting, canvasRef]);

    return (
      <canvas
        ref={canvasRef}
        width={CANVAS_CONSTANTS.WIDTH}
        height={CANVAS_CONSTANTS.HEIGHT}
      ></canvas>
    );
  }
);

export default DrawingCanvas;
