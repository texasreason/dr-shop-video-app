import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../contexts/AppStore';
import { ChromePicker } from 'react-color';
import { Palette, Eye, EyeOff } from 'lucide-react';

const ColorOverlayEditor: React.FC = () => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { colorOverlay, setColorOverlay } = useAppStore();

  const handleColorChange = (color: any) => {
    setColorOverlay({ color: color.hex });
  };

  const handleOpacityChange = (opacity: number) => {
    setColorOverlay({ opacity: opacity / 100 });
  };

  const handleWidthChange = (width: number) => {
    setColorOverlay({ width });
  };

  const handlePositionChange = (position: 'left' | 'right' | 'center') => {
    setColorOverlay({ position });
  };

  const toggleVisibility = () => {
    setColorOverlay({ visible: !colorOverlay.visible });
  };

  return (
    <div className="space-y-6">
      <h3 className="section-title">Color Overlay</h3>

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Show Overlay
        </label>
        <button
          onClick={toggleVisibility}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            colorOverlay.visible
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {colorOverlay.visible ? (
            <>
              <Eye className="h-4 w-4" />
              <span>Visible</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Hidden</span>
            </>
          )}
        </button>
      </div>

      {/* Color Picker */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Overlay Color
        </label>
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors w-full"
          >
            <div
              className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
              style={{ backgroundColor: colorOverlay.color }}
            />
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{colorOverlay.color}</span>
            </div>
          </button>
          
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-full left-0 z-50 mt-2"
            >
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
                <ChromePicker
                  color={colorOverlay.color}
                  onChange={handleColorChange}
                  disableAlpha={false}
                />
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="mt-3 w-full btn-secondary"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Opacity: {Math.round(colorOverlay.opacity * 100)}%
        </label>
        <div className="px-3">
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(colorOverlay.opacity * 100)}
            onChange={(e) => handleOpacityChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Width Control */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Width: {colorOverlay.width}px
        </label>
        <div className="px-3">
          <input
            type="range"
            min="100"
            max="1920"
            step="50"
            value={colorOverlay.width}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Position Control */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Position
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['left', 'center', 'right'] as const).map((position) => (
            <button
              key={position}
              onClick={() => handlePositionChange(position)}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                colorOverlay.position === position
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {position.charAt(0).toUpperCase() + position.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay Preview */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Preview
        </label>
        <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '200px' }}>
          {/* Background pattern to show transparency */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400" />
          
          {colorOverlay.visible && (
            <div
              className="absolute top-0 h-full transition-all duration-300"
              style={{
                backgroundColor: colorOverlay.color,
                opacity: colorOverlay.opacity,
                width: `${(colorOverlay.width / 1920) * 100}%`,
                left: colorOverlay.position === 'left' ? '0%' : 
                      colorOverlay.position === 'right' ? `${100 - (colorOverlay.width / 1920) * 100}%` : 
                      `${(100 - (colorOverlay.width / 1920) * 100) / 2}%`,
              }}
            />
          )}
          
          {/* Sample content to show overlay effect */}
          <div className="relative z-10 p-4 text-sm text-gray-700">
            <p>Video content would appear here</p>
            <p className="text-xs text-gray-500 mt-2">
              Overlay: {colorOverlay.width}px × {colorOverlay.height}px
            </p>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => setColorOverlay({
          color: '#000000',
          opacity: 0.5,
          visible: false,
          width: 750,
          height: 1080,
          position: 'right',
        })}
        className="w-full btn-secondary"
      >
        Reset to Defaults
      </button>
    </div>
  );
};

export default ColorOverlayEditor;
