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

  const toggleVisibility = () => {
    setColorOverlay({ visible: !colorOverlay.visible });
  };

  const toggleFloatingStyle = () => {
    setColorOverlay({ floatingStyle: !colorOverlay.floatingStyle });
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

      {/* Floating Style Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Floating Style (Rounded + Shadow)
        </label>
        <button
          onClick={toggleFloatingStyle}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            colorOverlay.floatingStyle
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {colorOverlay.floatingStyle ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    </div>
  );
};

export default ColorOverlayEditor;
