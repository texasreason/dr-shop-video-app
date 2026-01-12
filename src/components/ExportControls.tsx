import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../contexts/AppStore';
import { Download, Settings, CheckCircle, Eye } from 'lucide-react';
import FullResolutionPreview from './FullResolutionPreview';

interface ExportControlsProps {
  isExporting: boolean;
  setIsExporting: (exporting: boolean) => void;
}

const ExportControls: React.FC<ExportControlsProps> = ({ isExporting, setIsExporting }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  
  const {
    videoSettings,
    backgroundImage,
    overlayText,
    qrCode,
    colorOverlay,
    logo,
    products,
  } = useAppStore();

  const handleExport = async () => {
    if (!videoSettings.baseVideo) {
      alert('Please upload a background video first');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);

    try {
      // Simulate export process
      // In a real implementation, this would use FFmpeg.wasm or a server-side service
      await simulateExport();
      
      setExportComplete(true);
      setTimeout(() => {
        setExportComplete(false);
        setIsExporting(false);
        setExportProgress(0);
      }, 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const simulateExport = async (): Promise<void> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            resolve();
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    });
  };

  const getResolutionDimensions = () => {
    return videoSettings.resolution === '4K' 
      ? { width: 3840, height: 2160 }
      : { width: 1920, height: 1080 };
  };

  const dimensions = getResolutionDimensions();

  return (
    <div className="space-y-4">
      {/* Export Controls */}
      <div className="flex items-center space-x-3 flex-wrap">
        <button
          onClick={handleExport}
          disabled={isExporting || !videoSettings.baseVideo}
          className={`btn-primary flex items-center space-x-2 ${
            isExporting || !videoSettings.baseVideo
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {exportComplete ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>
            {exportComplete ? 'Export Complete!' : 'Export MP4'}
          </span>
        </button>

        <button
          onClick={() => setShowFullPreview(true)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>Actual 1920×1080</span>
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Export Settings */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-lg p-4 space-y-3"
        >
          <h4 className="font-medium text-gray-900">Export Settings</h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium">{videoSettings.duration}s</span>
            </div>
            <div>
              <span className="text-gray-600">Resolution:</span>
              <span className="ml-2 font-medium">{dimensions.width} × {dimensions.height}</span>
            </div>
            <div>
              <span className="text-gray-600">Audio:</span>
              <span className="ml-2 font-medium">
                {videoSettings.audioEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Products:</span>
              <span className="ml-2 font-medium">{products.length}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <p>• Background image: {backgroundImage.url ? 'Yes' : 'No'}</p>
            <p>• Text overlay: {overlayText.visible ? 'Yes' : 'No'}</p>
            <p>• QR code: {qrCode.visible ? 'Yes' : 'No'}</p>
            <p>• Color overlay: {colorOverlay.visible ? 'Yes' : 'No'}</p>
            <p>• Logo: {logo.visible && logo.url ? 'Yes' : 'No'}</p>
          </div>
        </motion.div>
      )}

      {/* Export Progress */}
      {isExporting && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Exporting Video</span>
            <span className="text-sm text-blue-700">{exportProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Processing video with all elements... This may take a few minutes.
          </p>
        </motion.div>
      )}

      {/* Export Complete */}
      {exportComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">Export Complete!</p>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your video has been generated and is ready for download.
          </p>
        </motion.div>
      )}

      {/* Export Requirements */}
      {!videoSettings.baseVideo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Please upload a background video before exporting.
          </p>
        </div>
      )}

      {/* Full Resolution Preview Modal */}
      <FullResolutionPreview 
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
      />
    </div>
  );
};

export default ExportControls;

