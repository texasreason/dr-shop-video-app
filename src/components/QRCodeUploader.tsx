import React, { useRef } from 'react';
import { useAppStore } from '../contexts/AppStore';
import { Upload, X, Eye, EyeOff, Move } from 'lucide-react';

const QRCodeUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    qrCode,
    setQRCode,
  } = useAppStore();

  const handleQRCodeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setQRCode({ 
        file,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleRemoveQRCode = () => {
    setQRCode({ file: undefined, url: undefined });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    setQRCode({
      position: {
        ...qrCode.position,
        [axis]: value,
      },
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    setQRCode({
      size: {
        ...qrCode.size,
        [dimension]: value,
      },
    });
  };

  const handleVisibilityToggle = () => {
    setQRCode({ visible: !qrCode.visible });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="section-title">QR Code</h3>
        <button
          onClick={handleVisibilityToggle}
          className={`p-2 rounded-lg transition-colors ${
            qrCode.visible
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {qrCode.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>

      {/* QR Code Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Upload QR Code Image
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 cursor-pointer transition-colors"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {qrCode.file ? qrCode.file.name : 'Click to upload QR code'}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleQRCodeUpload}
          className="hidden"
        />
      </div>

      {/* QR Code Preview */}
      {qrCode.url && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Preview
            </label>
            <button
              onClick={handleRemoveQRCode}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden p-4">
            <img
              src={qrCode.url}
              alt="QR Code preview"
              className="mx-auto"
              style={{
                width: qrCode.size.width,
                height: qrCode.size.height,
                opacity: qrCode.visible ? 1 : 0.3,
              }}
            />
          </div>
        </div>
      )}

      {/* Size Controls */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Size (Pixels)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Width</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="50"
                max="300"
                value={qrCode.size.width}
                onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12 text-right">
                {qrCode.size.width}px
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Height</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="50"
                max="300"
                value={qrCode.size.height}
                onChange={(e) => handleSizeChange('height', Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12 text-right">
                {qrCode.size.height}px
              </span>
            </div>
          </div>
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
                value={qrCode.position.x}
                onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12 text-right">
                {qrCode.position.x}%
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
                value={qrCode.position.y}
                onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12 text-right">
                {qrCode.position.y}%
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
          {qrCode.url && (
            <img
              src={qrCode.url}
              alt="QR Code"
              className="absolute"
              style={{
                left: `${qrCode.position.x}%`,
                top: `${qrCode.position.y}%`,
                transform: 'translate(-50%, -50%)',
                width: qrCode.size.width,
                height: qrCode.size.height,
                opacity: qrCode.visible ? 1 : 0.3,
              }}
            />
          )}
        </div>
      </div>

      {/* Usage Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Position the QR code in a corner or bottom area 
          where it won't interfere with your main content.
        </p>
      </div>
    </div>
  );
};

export default QRCodeUploader;

