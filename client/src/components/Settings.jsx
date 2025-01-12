import React from "react";
import { CanvasContext } from "../Canvas";
import CroppingSettings from "./CroppingSettings";

const Settings = () => {
  const { canvasInstance, selectedObject, frames, refreshKey } =
    React.useContext(CanvasContext);
  const [width, setWidth] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [diameter, setDiameter] = React.useState("");
  const [color, setColor] = React.useState("");
  const [strokeColor, setStrokeColor] = React.useState("");
  const [strokeWidth, setStrokeWidth] = React.useState("");

  React.useEffect(() => {
    if (selectedObject) {
      if (selectedObject?.name?.startsWith("Frame")) {
        return;
      }

      if (selectedObject.type === "rect") {
        setWidth(Math.round(selectedObject.width * selectedObject.scaleX));
        setHeight(Math.round(selectedObject.height * selectedObject.scaleY));
        setColor(selectedObject.fill);
      } else if (selectedObject.type === "circle") {
        setWidth("");
        setHeight("");
        setDiameter(Math.round(selectedObject.radius * 2));
        setColor(selectedObject.fill);
      }
    } else {
      setWidth("");
      setHeight("");
      setDiameter("");
      setColor("");
    }
  }, [selectedObject]);

  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    if (selectedObject && selectedObject.type === "rect") {
      selectedObject.set({ width: newWidth });
      canvasInstance.current.renderAll();
    }
  };

  const handleHeightChange = (e) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    if (selectedObject && selectedObject.type === "rect") {
      selectedObject.set({ height: newHeight });
      canvasInstance.current.renderAll();
    }
  };

  const handleDiameterChange = (e) => {
    const newDiameter = e.target.value;
    setDiameter(newDiameter);
    if (selectedObject && selectedObject.type === "circle") {
      selectedObject.set({ radius: newDiameter / 2 });
      canvasInstance.current.renderAll();
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);

    if (selectedObject) {
      selectedObject.set({ fill: newColor });

      // Force recalculation of object position/coords
      selectedObject.setCoords();

      // Re-render the canvas to apply the changes
      canvasInstance.current.renderAll();
    }
  };

  const handleStrokeWidthChange = (e) => {
    const newStrokeWidth = parseInt(e.target.value, 10);
    setStrokeWidth(newStrokeWidth);

    if (selectedObject) {
      const currentStrokeWidth = selectedObject.strokeWidth || 0;
      const scaleFactor = (newStrokeWidth - currentStrokeWidth) / 2;

      selectedObject.set({
        strokeWidth: newStrokeWidth,
      });

      canvasInstance.current.renderAll();
    }
  };

  const handleStrokeColorChange = (e) => {
    const newStrokeColor = e.target.value;
    setStrokeColor(newStrokeColor);

    if (selectedObject) {
      selectedObject.set({ stroke: newStrokeColor });
      canvasInstance.current.renderAll();
    }
  };

  const notFrame = selectedObject?.name?.startsWith("Frame");

  return (
    <>
      {selectedObject && !notFrame ? (
        <div className="mt-5 w-full p-6 bg-white rounded-lg shadow-md">
          {/* Rectangle Section */}
          {selectedObject.type === "rect" && (
            <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50 rounded-lg w-full max-w-md">
              <div className="flex flex-col w-full gap-4">
                {/* Width Input */}
                <label
                  htmlFor="width"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Width
                </label>
                <input
                  type="number"
                  value={width}
                  id="width"
                  onChange={handleWidthChange}
                  className="w-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Enter width"
                />
              </div>

              <div className="flex flex-col w-full gap-4">
                {/* Height Input */}
                <label
                  htmlFor="height"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Height
                </label>
                <input
                  type="number"
                  value={height}
                  id="height"
                  onChange={handleHeightChange}
                  className="w-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Enter height"
                />
              </div>

              {/* Stroke Width Input */}
              <div className="flex flex-col w-full gap-4">
                <label
                  htmlFor="strokeWidth"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Stroke Width
                </label>
                <input
                  type="number"
                  value={strokeWidth}
                  id="strokeWidth"
                  onChange={handleStrokeWidthChange}
                  className="w-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Enter stroke width"
                />
              </div>

              {/* Stroke Color Input */}
              <div className="flex flex-col w-full gap-4">
                <label
                  htmlFor="strokeColor"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Stroke Color
                </label>
                <input
                  type="color"
                  value={strokeColor}
                  id="strokeColor"
                  onChange={handleStrokeColorChange}
                  className="w-10 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Circle Section */}
          {selectedObject.type === "circle" && !notFrame && (
            <div className="p-2">
              <div className="bg-gray-100 grid grid-cols-2 gap-5 p-6 rounded-lg">
                <div className="flex flex-col w-full gap-4">
                  <label
                    htmlFor="diameter"
                    className="text-sm font-medium text-gray-700 mb-2"
                  >
                    Diameter
                  </label>
                  <input
                    type="number"
                    value={diameter}
                    id="diameter"
                    onChange={handleDiameterChange}
                    className="w-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="Enter diameter"
                  />
                </div>
                {/* Stroke Width Input */}
                <div className="flex flex-col w-full gap-4">
                  <label
                    htmlFor="strokeWidth"
                    className="text-sm font-medium text-gray-700 mb-2"
                  >
                    Stroke Width
                  </label>
                  <input
                    type="number"
                    value={strokeWidth}
                    id="strokeWidth"
                    onChange={handleStrokeWidthChange}
                    className="w-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="Enter stroke width"
                  />
                </div>

                {/* Stroke Color Input */}
                <div className="flex flex-col w-full gap-4">
                  <label
                    htmlFor="strokeColor"
                    className="text-sm font-medium text-gray-700 mb-2"
                  >
                    Stroke Color
                  </label>
                  <input
                    type="color"
                    value={strokeColor}
                    id="strokeColor"
                    onChange={handleStrokeColorChange}
                    className="w-10 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Color Section */}
          {!notFrame && (
            <div className="flex flex-col w-full gap-4 mt-6">
              <label
                htmlFor="color"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={color}
                  id="color"
                  onChange={handleColorChange}
                  className="w-10 h-10 border-2 border-gray-300 rounded-full cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div
                  className="w-10 h-10 border-2 border-gray-300 rounded-md"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="w-full mt-5 p-6 bg-white rounded-lg shadow-md opacity-50 cursor-not-allowed">
            <div className="flex justify-center items-center gap-8 p-6 bg-gray-50 rounded-lg w-full max-w-md">
              <div className="flex flex-col w-full gap-4">
                {/* Disabled Width Input */}
                <label
                  htmlFor="width"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Width
                </label>
                <input
                  type="number"
                  value={width}
                  id="width"
                  disabled
                  className="w-32 px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed placeholder:text-[.8rem]"
                  placeholder="Enter width"
                />
              </div>

              <div className="flex flex-col w-full gap-4">
                {/* Disabled Height Input */}
                <label
                  htmlFor="height"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Height
                </label>
                <input
                  type="number"
                  value={height}
                  id="height"
                  disabled
                  className="w-32 px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed placeholder:text-[.8rem]"
                  placeholder="Enter height"
                />
              </div>
            </div>

            <div className="flex flex-col w-full gap-4">
              <label
                htmlFor="strokeColor"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Stroke Color
              </label>
              <input
                type="color"
                value={strokeColor}
                id="strokeColor"
                onChange={handleStrokeColorChange}
                className="w-10 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col w-full gap-4 mt-6">
              <label
                htmlFor="color"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={color}
                  id="color"
                  disabled
                  className="w-10 h-10 border-2 border-gray-300 rounded-full bg-gray-100 cursor-not-allowed"
                />
                <div
                  className="w-10 h-10 border-2 border-gray-300 rounded-md"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          </div>
          {selectedObject && frames.length > 0 && (
            <CroppingSettings
              canvas={canvasInstance.current}
              frames={frames}
              refreshKey={refreshKey}
            />
          )}
        </>
      )}
    </>
  );
};

export default Settings;
