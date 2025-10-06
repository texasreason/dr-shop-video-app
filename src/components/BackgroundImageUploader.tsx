import React, { useRef, useState } from 'react';
import { useAppStore } from '../contexts/AppStore';
import { Upload, X, Eye, EyeOff } from 'lucide-react';

const BackgroundImageUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const {
    backgroundImage,
    setBackgroundImage,
  } = useAppStore();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBackgroundImage({ 
        file,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleRemoveImage = () => {
    setBackgroundImage({ file: undefined, url: undefined });
  };

  const handleOpacityChange = (opacity: number) => {
    setBackgroundImage({ opacity: opacity / 100 });
  };

  const handleGradientToggle = () => {
    setBackgroundImage({
      gradient: {
        ...backgroundImage.gradient,
        enabled: !backgroundImage.gradient.enabled,
      },
    });
  };

  const handleGradientColorChange = (color: string) => {
    setBackgroundImage({
      gradient: {
        ...backgroundImage.gradient,
        color,
      },
    });
  };

  const handleGradientOpacityChange = (opacity: number) => {
    setBackgroundImage({
      gradient: {
        ...backgroundImage.gradient,
        opacity: opacity / 100,
      },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="section-title">Background Image</h3>

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Upload Background Image
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 cursor-pointer transition-colors"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {backgroundImage.file ? backgroundImage.file.name : 'Click to upload image'}
          </p>
          <p className="text-xs text-gray-500">JPG, PNG, GIF up to 10MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Image Preview */}
      {backgroundImage.url && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Preview
            </label>
            <button
              onClick={handleRemoveImage}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={backgroundImage.url}
              alt="Background preview"
              className="w-full h-48 object-cover"
              style={{ opacity: backgroundImage.opacity }}
            />
          </div>
        </div>
      )}

      {/* Opacity Control */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Opacity: {Math.round(backgroundImage.opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={backgroundImage.opacity * 100}
          onChange={(e) => handleOpacityChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Transparent</span>
          <span>Opaque</span>
        </div>
      </div>

      {/* Gradient Overlay Controls */}
      <div className="space-y-4 border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Bottom Gradient Overlay (540px)
          </label>
          <button
            onClick={handleGradientToggle}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              backgroundImage.gradient.enabled
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {backgroundImage.gradient.enabled ? (
              <>
                <Eye className="h-4 w-4" />
                <span>Enabled</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Disabled</span>
              </>
            )}
          </button>
        </div>

        {backgroundImage.gradient.enabled && (
          <div className="space-y-4">
            {/* Color Picker */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Gradient Color
              </label>
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer shadow-sm"
                  style={{ backgroundColor: backgroundImage.gradient.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <input
                  type="color"
                  value={backgroundImage.gradient.color}
                  onChange={(e) => handleGradientColorChange(e.target.value)}
                  className="w-20 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900">
                  {backgroundImage.gradient.color}
                </span>
              </div>
            </div>

            {/* Gradient Opacity */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Gradient Opacity: {Math.round(backgroundImage.gradient.opacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={backgroundImage.gradient.opacity * 100}
                onChange={(e) => handleGradientOpacityChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Transparent</span>
                <span>Solid</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> The background image will be overlaid on your video. 
          The gradient covers the bottom 540px (half height) of the 1080px canvas.
        </p>
      </div>
    </div>
  );
};

export default BackgroundImageUploader;

