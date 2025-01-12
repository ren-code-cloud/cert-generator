import React, { useEffect, useState } from 'react';

const CroppingSettings = ({ canvas, frames, refreshKey }) => {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFrameSelect = (frame) => {
    setSelectedFrame(frame);
    canvas.setActiveObject(frame);
    canvas.renderAll();
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const exportAsPNG = () => {
    if (!selectedFrame) return;

    frames.forEach((frame) => {
      frame.set('visible', false);
    });

    selectedFrame.set({
      strokeWidth: 0,
      visible: true,
    });

    const dataURL = canvas.toDataURL({
      left: selectedFrame.left,
      top: selectedFrame.top,
      width: selectedFrame.width * selectedFrame.scaleX,
      height: selectedFrame.height * selectedFrame.scaleY,
      format: 'png',
    });

    selectedFrame.set({
      strokeWidth: 1,
    });

    frames.forEach((frame) => {
      frame.set('visible', true);
    });

    canvas.renderAll();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${selectedFrame.name}.png`;
    link.click();
  };

  useEffect(() => {
    if (frames.length > 0) {
      setSelectedFrame(frames[0]);
    }
  }, [frames, refreshKey]);

  return (
    <div className={`${frames.length > 0 ? "bg-gray-800" : "bg-transparent" } text-white p-4 rounded-lg shadow-lg w-80`}>
      {frames.length > 0 && (
        <>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="Select a frame"
              className="text-left p-3 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none"
            >
              {selectedFrame?.name || 'Select a frame'}
            </button>
            {isDropdownOpen && (
              <ul
        
                className="bg-gray-700 border border-gray-600 rounded-lg mt-2 w-full z-10"
              >
                {frames.map((frame, index) => (
                  <li
                    key={index}
                    onClick={() => handleFrameSelect(frame)}
                    className={`p-2 cursor-pointer hover:bg-gray-600 ${
                      selectedFrame?.name === frame.name ? 'bg-gray-600' : ''
                    }`}
                  >
                    {frame.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={exportAsPNG}
            className=" mt-4 p-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-200 focus:outline-none"
          >
            Export as PNG
          </button>
        </>
      )}
    </div>
  );
};

export default CroppingSettings;