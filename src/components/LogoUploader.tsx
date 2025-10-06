import React, { useRef } from 'react';
import { useAppStore } from '../contexts/AppStore';
import { Upload, Eye, EyeOff, X } from 'lucide-react';

const LogoUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logo, setLogo } = useAppStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setLogo({ file, url, visible: true });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    if (logo.url) {
      URL.revokeObjectURL(logo.url);
    }
    setLogo({ file: undefined, url: undefined, visible: false });
  };

  const toggleVisibility = () => {
    setLogo({ visible: !logo.visible });
  };

  const handleScaleChange = (scale: number) => {
    setLogo({ scale });
  };

  const handlePositionXChange = (x: number) => {
    setLogo({ 
      position: { 
        ...logo.position, 
        x 
      } 
    });
  };

  const handlePositionYChange = (y: number) => {
    setLogo({ 
      position: { 
        ...logo.position, 
        y 
      } 
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="section-title">Logo</h3>

      {/* Logo Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Upload Logo
        </label>
        
        {!logo.url ? (
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 cursor-pointer transition-colors"
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload logo
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-200">
              <img
                src={logo.url}
                alt="Logo preview"
                className="max-h-32 mx-auto"
                style={{
                  width: `${logo.width}px`,
                  height: `${logo.height}px`,
                  objectFit: 'contain'
                }}
              />
              <button
                onClick={removeLogo}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <button
              onClick={handleUploadClick}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Replace Logo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Visibility Toggle */}
      {logo.url && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Show Logo
          </label>
          <button
            onClick={toggleVisibility}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              logo.visible
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {logo.visible ? (
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
      )}

      {/* Scale Control */}
      {logo.url && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Scale: {logo.scale}%
            </label>
            <div className="px-3">
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={logo.scale}
                onChange={(e) => handleScaleChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Position X: {logo.position.x}px
            </label>
            <div className="px-3">
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={logo.position.x}
                onChange={(e) => handlePositionXChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Position Y: {logo.position.y}px
            </label>
            <div className="px-3">
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={logo.position.y}
                onChange={(e) => handlePositionYChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      {logo.url && (
        <button
          onClick={() => setLogo({
            width: 100,
            height: 100,
            scale: 100,
            position: {
              x: 0,
              y: 0,
            },
            visible: false,
          })}
          className="w-full btn-secondary"
        >
          Reset Scale, Position & Visibility
        </button>
      )}
    </div>
  );
};

export default LogoUploader;
