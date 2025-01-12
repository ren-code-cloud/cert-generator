export function renderIcon(icon) {
  return function (ctx, left, top, _styleOverride, fabricObject) {
    const size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}

export function deleteObject(_eventData, transform) {
  const canvas = transform.target.canvas;
  canvas.remove(transform.target);
  canvas.requestRenderAll();
}
