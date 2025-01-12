import React from "react";
import * as fabric from "fabric";
import { FaCropSimple } from "react-icons/fa6";
import deleteIcon from "../assets/delete.png";
import copyIcon from "../assets/copy.png";
import { deleteObject } from "../utilities/customFunc";

const Cropping = ({ canvas, onFramesUpdated }) => {
  const addFrameToCanvas = () => {
    if (!canvas) {
      console.log("Canvas is not Initialized!");
      return;
    }

    const frameName = `Frame ${canvas.current.getObjects("rect").length + 1}`;
    const frame = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      fill: "transparent",
      stroke: "#333",
      strokeWidth: 1,
      selectable: true,
      evented: true,
      name: frameName,
    });

    frame.controls.deleteControls = new fabric.Control({
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

    frame.controls.cloneControl = new fabric.Control({
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
          ); // Draw the image at control position
          ctx.restore();
        };
      },
      cornerSize: 24,
    });

    canvas.current.add(frame);
    canvas.current.renderAll();

    const maintainStrokeWidth = (object) => {
      const scaleX = object.scaleX || 1;
      const scaleY = object.scaleY || 1;

      object.set({
        width: object.width * scaleX,
        height: object.height * scaleY,
        scaleX: 1,
        scaleY: 1,
        strokeWidth: 1,
      });

      object.setCoords();
    };

    frame.on("scaling", () => {
      maintainStrokeWidth(frame);
      canvas.current.renderAll();
    });

    frame.on("modified", () => {
      maintainStrokeWidth(frame);
      canvas.current.renderAll();
    });

    // Add functionality to allow deselecting when clicking on a selected frame.
    frame.on("mouse:down", (e) => {
      if (e.target === frame && canvas.current.getActiveObject() === frame) {
        canvas.current.discardActiveObject(); // Deselect the object
      } else {
        canvas.current.setActiveObject(frame); // Select the frame
      }
      canvas.current.renderAll();
    });

    // Notify parent component about the new frame
    onFramesUpdated();
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

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={addFrameToCanvas}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none"
      >
        Crop
      </button>
    </div>
  );
};

export default Cropping;
