import { useState } from "react";

export default function CommentSingleImg({ ImageUrl }) {
  const [zoomIn, setZoomIn] = useState(false);
  return (
    <div
      className={`${
        zoomIn
          ? "fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          : "relative"
      }`}
    >
      <img
        src={ImageUrl}
        alt="Zoomed"
        onClick={() => setZoomIn(true)}
        className={`cursor-pointer transition-all duration-300 ${
          zoomIn ? "max-h-full max-w-full" : "max-w-30 max-h-30"
        }`}
      />
      {zoomIn && (
        <button
          onClick={() => setZoomIn(false)}
          className="absolute top-4 right-6 text-white text-3xl font-bold cursor-pointer transition-all hover:scale-125"
        >
          ×
        </button>
      )}
    </div>
  );
}
