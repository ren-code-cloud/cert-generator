import React, { useCallback } from "react";
import * as fabric from "fabric";
import { RiRectangleFill } from "react-icons/ri";
import { FaCircle } from "react-icons/fa";
import Button from "./components/Button";
import { NavLink, Outlet } from "react-router-dom";
import Cropping from "./components/Cropping";
import { deleteObject, renderIcon } from "./utilities/customFunc";
import deleteIcon from "./assets/delete.png";
import copyIcon from "./assets/copy.png";
import Toggle from "./components/Toggle";
import {
  clearGuidelines,
  handleObjectMoving,
} from "./utilities/snappingHelper";
const CanvasContext = React.createContext();

const Canvas = () => {
  const canvas = React.useRef(null);
  const canvasInstance = React.useRef(null); // Use useRef here
  const [selectedObject, setSelectedObject] = React.useState(null);
  const [guidelines, setGuidelines] = React.useState([]);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [frames, setFrames] = React.useState(0);

  // Mount canvas
  React.useEffect(() => {
    if (canvas.current && !canvasInstance.current) {
      const initCanvas = new fabric.Canvas(canvas.current, {
        width: 500,
        height: 500,
        backgroundColor: "#fff",
      });

      // Set up event listeners for object selection
      initCanvas.on("selection:created", (e) => {
        setSelectedObject(e.selected[0]);
      });
      initCanvas.on("selection:updated", (e) => {
        setSelectedObject(e.selected[0]);
      });
      initCanvas.on("selection:cleared", () => {
        setSelectedObject(null);
      });

      initCanvas.renderAll();
      canvasInstance.current = initCanvas; // Store the canvas instance in useRef

      initCanvas.on("object:moving", (event) => {
        handleObjectMoving(initCanvas, event.target, guidelines, setGuidelines);
      });

      initCanvas.on("object:modified", () => {
        clearGuidelines(initCanvas);
      });

      return () => {
        if (canvasInstance.current) {
          canvasInstance.current.dispose();
          canvasInstance.current = null;
        }
      };
    }
  }, []);

  const addingShapeCircle = () => {
    if (canvasInstance.current) {
      const circle = new fabric.Circle({
        top: 100,
        left: 50,
        radius: 50,
        fill: "#4CAF50",
      });

      circle.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: 16,
        cursorStyle: "pointer",
        mouseUpHandler: deleteObject,
        render: (ctx, left, top, styleOverride, fabricObject) => {
          const iconSize = 16;
          const iconImage = new Image();
          iconImage.src = `${deleteIcon}`;
          iconImage.onload = () => {
            ctx.save();
            ctx.translate(left, top);
            ctx.drawImage(
              iconImage,
              -iconSize / 2,
              -iconSize / 2,
              iconSize,
              iconSize
            );
            ctx.restore();
          };
        },
      });

      circle.controls.cloneControl = new fabric.Control({
        x: -0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: -16,
        cursorStyle: "pointer",
        mouseUpHandler: cloneObject,
        render: (ctx, left, top, styleOverride, fabricObject) => {
          const iconSize = 16;
          const iconImage = new Image();
          iconImage.src = `${copyIcon}`;
          iconImage.onload = () => {
            ctx.save();
            ctx.translate(left, top);
            ctx.drawImage(
              iconImage,
              -iconSize / 2,
              -iconSize / 2,
              iconSize,
              iconSize
            );
            ctx.restore();
          };
        },
        cornerSize: 24,
      });

      canvasInstance.current.add(circle);
    }
  };

  const addingShapeRect = () => {
    if (canvasInstance.current) {
      const rect = new fabric.Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#DB4D42",
        shadow: { color: "rgba(0,0,0,0.3)" },
        cornerSize: 24,
      });

      rect.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: 16,
        cursorStyle: "pointer",
        mouseUpHandler: deleteObject,
        render: (ctx, left, top, styleOverride, fabricObject) => {
          const iconSize = 16;
          const iconImage = new Image();
          iconImage.src = `${deleteIcon}`;
          iconImage.onload = () => {
            ctx.save();
            ctx.translate(left, top);
            ctx.drawImage(
              iconImage,
              -iconSize / 2,
              -iconSize / 2,
              iconSize,
              iconSize
            );
            ctx.restore();
          };
        },
      });

      rect.controls.cloneControl = new fabric.Control({
        x: -0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: -16,
        cursorStyle: "pointer",
        mouseUpHandler: cloneObject,
        render: (ctx, left, top, styleOverride, fabricObject) => {
          const iconSize = 16;
          const iconImage = new Image();
          iconImage.src = `${copyIcon}`;
          iconImage.onload = () => {
            ctx.save();
            ctx.translate(left, top);
            ctx.drawImage(
              iconImage,
              -iconSize / 2,
              -iconSize / 2,
              iconSize,
              iconSize
            );
            ctx.restore();
          };
        },
        cornerSize: 24,
      });

      canvasInstance.current.add(rect);
    }
  };

  function cloneObject(_eventData, transform) {
    const canvas = transform.target.canvas;
    transform.target.clone().then((cloned) => {
      cloned.left += 10;
      cloned.top += 10;
      cloned.controls.deleteControl = transform.target.controls.deleteControl;
      cloned.controls.cloneControl = transform.target.controls.cloneControl;
      canvas.add(cloned);
    });
  }

  const handleFramesUpdated = useCallback(() => {
    const framesFromCanvas = canvasInstance.current
      .getObjects("rect")
      .filter((obj) => {
        return obj.name && obj.name.startsWith("Frame");
      });

    setFrames(framesFromCanvas);
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <CanvasContext.Provider
      value={{ canvasInstance, selectedObject, frames, refreshKey }}
    >
      <div className="w-full h-screen grid grid-cols-7 ">
        <div className="col-span-5 relative flex justify-center items-center">
          <canvas className="rounded-lg shadow-2xl" ref={canvas} />
          <div className="absolute bg-slate-800  left-3 top-1/2 transform -translate-y-1/2 py-5 rounded-md flex flex-col justify-center items-center gap-5 ">
            <Toggle className="relative">
              <Toggle.Button className="bg-[#FFFBE6] p-2 mx-5 rounded-lg font-medium">
                Shapes
              </Toggle.Button>
              <Toggle.Show className="mt-2 bg-white/90 rounded-lg shadow-lg p-5 absolute z-50 text-center flex flex-col justify-center items-center gap-5 w-full">
                <Button
                  className="w-full bg-slate-800 text-white py-2 text-xs rounded-lg"
                  onClick={addingShapeRect}
                >
                  Rectangle
                </Button>
                <Button
                  className="w-full bg-slate-800 text-white py-2 text-xs rounded-lg"
                  onClick={addingShapeCircle}
                >
                  Circle
                </Button>
              </Toggle.Show>
            </Toggle>
            <Cropping
              canvas={canvasInstance}
              onFramesUpdated={handleFramesUpdated}
            />
          </div>
        </div>
        <div
          className="col-span-2 bg-[#FFFDF0]"
          style={{ borderLeft: "1px solid rgba(3,3,3,.3" }}
        >
          <header>
            <ul>
              <NavLink
                to={"/settings"}
                className={({ isActive }) =>
                  `text-gray-700 px-4 py-2 text-lg 
                  ${
                    isActive
                      ? "border-b-2 border-blue-500"
                      : "border-b-2 border-transparent"
                  } 
                  transition-all duration-300 ease-in-out`
                }
              >
                Tools
              </NavLink>

              <NavLink
                to={"/export"}
                className={({ isActive }) =>
                  `text-gray-700 px-4 py-2 text-lg 
                  ${
                    isActive
                      ? "border-b-2 border-blue-500"
                      : "border-b-2 border-transparent"
                  } 
                  transition-all duration-300 ease-in-out`
                }
              >
                Export
              </NavLink>
            </ul>
          </header>
          <Outlet />
        </div>
      </div>
    </CanvasContext.Provider>
  );
};

export default Canvas;
export { CanvasContext };
