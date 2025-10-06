import React from 'react';
import { useAppStore } from '../contexts/AppStore';
import { Type, Move, Eye, EyeOff } from 'lucide-react';

const TextOverlayEditor: React.FC = () => {
  const {
    overlayText,
    setOverlayText,
  } = useAppStore();

  const handleContentChange = (content: string) => {
    setOverlayText({ content });
  };

  const handleFontSizeChange = (fontSize: number) => {
    setOverlayText({ fontSize });
  };


  const handleColorChange = (color: string) => {
    setOverlayText({ color });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    setOverlayText({
      position: {
        ...overlayText.position,
        [axis]: value,
      },
    });
  };

  const handleVisibilityToggle = () => {
    setOverlayText({ visible: !overlayText.visible });
  };


  const colors = [
    '#ffffff',
    '#000000',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#ffa500',
    '#800080',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Text Overlay</h3>
        <button
          onClick={handleVisibilityToggle}
          className={`p-2 rounded-lg transition-colors ${
            overlayText.visible
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {overlayText.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>

      {/* Text Content */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Text Content
        </label>
        <textarea
          value={overlayText.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Enter your text here..."
          className="input-field resize-none h-20"
        />
      </div>

      {/* Font Settings */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Font Size
        </label>
        <input
          type="number"
          min="12"
          max="72"
          value={overlayText.fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
          className="input-field"
        />
        <p className="text-sm text-gray-500">Font style: Street3 (fixed)</p>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Text Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                overlayText.color === color
                  ? 'border-gray-800 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={overlayText.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <span className="text-sm text-gray-600">Custom color</span>
        </div>
      </div>

      {/* Position Controls */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Position (Percentage)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">X Position</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="100"
                value={overlayText.position.x}
                onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12 text-right">
                {overlayText.position.x}%
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Y Position</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="100"
                value={overlayText.position.y}
                onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12 text-right">
                {overlayText.position.y}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Live Preview
        </label>
        <div className="relative bg-gray-900 rounded-lg h-32 overflow-hidden">
          <div
            className="absolute"
            style={{
              left: `${overlayText.position.x}%`,
              top: `${overlayText.position.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${overlayText.fontSize}px`,
              fontFamily: overlayText.fontFamily,
              color: overlayText.color,
              opacity: overlayText.visible ? 1 : 0,
              whiteSpace: 'nowrap',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {overlayText.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextOverlayEditor;

