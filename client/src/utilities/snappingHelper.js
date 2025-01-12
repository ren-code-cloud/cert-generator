import { Line } from "fabric";

const snappingDistance = 18;

export const handleObjectMoving = (canvas, obj, guidelines, setGuidelines) => {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const left = obj.left;
  const top = obj.top;
  const right = left + obj.width * obj.scaleX;
  const bottom = top + obj.height * obj.scaleY;

  const centerX = left + (obj.width * obj.scaleX) / 2;
  const centerY = top + (obj.height * obj.scaleY) / 2;

  let newGuidelines = [];
  clearGuidelines(canvas); // Remove existing guidelines first.

  let snapped = false;

  // Check if the object is close to the left edge
  if (Math.abs(left) < snappingDistance) {
    obj.set({ left: 0 });
    if (!guidelinesExists(canvas, "vertical-left")) {
      const line = createGuideline(canvas, 0, "vertical", "vertical-left");
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // Check if the object is close to the top edge
  if (Math.abs(top) < snappingDistance) {
    obj.set({ top: 0 });
    if (!guidelinesExists(canvas, "horizontal-top")) {
      const line = createGuideline(canvas, 0, "horizontal", "horizontal-top");
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // Check if the object is close to the right edge
  if (Math.abs(right - canvasWidth) < snappingDistance) {
    obj.set({ left: canvasWidth - obj.width * obj.scaleX });
    if (!guidelinesExists(canvas, "vertical-right")) {
      const line = createGuideline(
        canvas,
        canvasWidth,
        "vertical",
        "vertical-right"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // Check if the object is close to the bottom edge
  if (Math.abs(bottom - canvasHeight) < snappingDistance) {
    obj.set({ top: canvasHeight - obj.height * obj.scaleY });
    if (!guidelinesExists(canvas, "horizontal-bottom")) {
      const line = createGuideline(
        canvas,
        canvasHeight,
        "horizontal",
        "horizontal-bottom"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // Check if the object is close to the center horizontally
  if (Math.abs(centerX - canvasWidth / 2) < snappingDistance) {
    obj.set({ left: canvasWidth / 2 - (obj.width * obj.scaleX) / 2 });
    if (!guidelinesExists(canvas, "vertical-center")) {
      const line = createGuideline(
        canvas,
        canvasWidth / 2,
        "vertical",
        "vertical-center"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // Check if the object is close to the center vertically
  if (Math.abs(centerY - canvasHeight / 2) < snappingDistance) {
    obj.set({ top: canvasHeight / 2 - (obj.height * obj.scaleY) / 2 });
    if (!guidelinesExists(canvas, "horizontal-center")) {
      const line = createGuideline(
        canvas,
        canvasHeight / 2,
        "horizontal",
        "horizontal-center"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // If any guideline was added, render the canvas with guidelines
  if (snapped) {
    canvas.renderAll();
  } else {
    setGuidelines(newGuidelines); // Update guidelines state if necessary
  }

  // Always re-render the canvas
  canvas.renderAll();
};

// Function to create horizontal or vertical guideline
export const createGuideline = (canvas, position, orientation, id) => {
  // orientation: "vertical" or "horizontal"
  if (orientation === "vertical") {
    return new Line([position, 0, position, canvas.height], {
      id,
      stroke: "red",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      strokeDashArray: [5, 5],
      opacity: 0.8,
    });
  } else {
    return new Line([0, position, canvas.width, position], {
      id,
      stroke: "red",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      strokeDashArray: [5, 5],
      opacity: 0.8,
    });
  }
};

export const clearGuidelines = (canvas) => {
  const objects = canvas.getObjects("line");
  objects.forEach((obj) => {
    if (
      (obj.id && obj.id.startsWith("vertical-")) ||
      obj.id.startsWith("horizontal-")
    ) {
      canvas.remove(obj);
    }
  });
  canvas.renderAll();
};

const guidelinesExists = (canvas, id) => {
  const objects = canvas.getObjects("line");
  return objects.some((obj) => obj.id === id);
};
