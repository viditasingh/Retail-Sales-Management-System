import { useState, useRef, useEffect } from "react";

export default function RangeSlider({
  label,
  minValue,
  maxValue,
  min = 0,
  max = 100,
  onChange,
  minParamKey,
  maxParamKey,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragging, setDragging] = useState(null);
  const dropdownRef = useRef(null);
  const trackRef = useRef(null);

  const currentMin = minValue ? parseInt(minValue) : min;
  const currentMax = maxValue ? parseInt(maxValue) : max;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasSelection = minValue || maxValue;
  const displayText = hasSelection ? `${currentMin} - ${currentMax}` : label;

  const minPercent = ((currentMin - min) / (max - min)) * 100;
  const maxPercent = ((currentMax - min) / (max - min)) * 100;

  // Handle mouse/touch events for slider
  const getValueFromPosition = (clientX) => {
    if (!trackRef.current) return null;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );
    return Math.round(min + (percent / 100) * (max - min));
  };

  const handleTrackMouseDown = (e) => {
    const value = getValueFromPosition(e.clientX);
    if (value === null) return;

    // Determine which thumb is closer
    const distToMin = Math.abs(value - currentMin);
    const distToMax = Math.abs(value - currentMax);

    if (distToMin <= distToMax) {
      setDragging("min");
      if (value <= currentMax) {
        onChange(minParamKey, value === min ? "" : value.toString());
      }
    } else {
      setDragging("max");
      if (value >= currentMin) {
        onChange(maxParamKey, value === max ? "" : value.toString());
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const value = getValueFromPosition(e.clientX);
    if (value === null) return;

    if (dragging === "min" && value <= currentMax) {
      onChange(minParamKey, value === min ? "" : value.toString());
    } else if (dragging === "max" && value >= currentMin) {
      onChange(maxParamKey, value === max ? "" : value.toString());
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, currentMin, currentMax]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium min-w-[130px] justify-between shadow-sm border ${
          hasSelection
            ? "bg-gray-100 border-gray-400 text-gray-900 hover:bg-gray-200"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
        } ${isOpen ? "ring-2 ring-gray-400/30 border-gray-400" : ""}`}
      >
        <span>{displayText}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 min-w-[280px]">
          {/* Current range display */}
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-4">
            <span className="bg-gray-100 px-2 py-1 rounded">{currentMin}</span>
            <span className="text-gray-400">to</span>
            <span className="bg-gray-100 px-2 py-1 rounded">{currentMax}</span>
          </div>

          {/* Dual range slider */}
          <div
            className="relative h-6 mb-4 cursor-pointer select-none"
            ref={trackRef}
            onMouseDown={handleTrackMouseDown}
          >
            {/* Track background */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full" />

            {/* Active track */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 bg-gray-800 rounded-full pointer-events-none"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            />

            {/* Min visual thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-800 rounded-full shadow-md cursor-grab ${
                dragging === "min"
                  ? "scale-110 cursor-grabbing"
                  : "hover:scale-105"
              }`}
              style={{ left: `calc(${minPercent}% - 10px)`, zIndex: 10 }}
            />

            {/* Max visual thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-800 rounded-full shadow-md cursor-grab ${
                dragging === "max"
                  ? "scale-110 cursor-grabbing"
                  : "hover:scale-105"
              }`}
              style={{ left: `calc(${maxPercent}% - 10px)`, zIndex: 10 }}
            />
          </div>

          {/* Number inputs */}
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min</label>
              <input
                type="number"
                placeholder={min.toString()}
                value={minValue || ""}
                onChange={(e) => onChange(minParamKey, e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400"
                min={min}
                max={max}
              />
            </div>
            <span className="text-gray-400 mt-5">—</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max</label>
              <input
                type="number"
                placeholder={max.toString()}
                value={maxValue || ""}
                onChange={(e) => onChange(maxParamKey, e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400"
                min={min}
                max={max}
              />
            </div>
          </div>

          {/* Clear button */}
          {hasSelection && (
            <button
              onClick={() => {
                onChange(minParamKey, "");
                onChange(maxParamKey, "");
              }}
              className="w-full mt-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
