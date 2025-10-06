import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../contexts/AppStore';
import { Upload, Play, Pause } from 'lucide-react';

const VideoControls: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    videoSettings,
    setVideoSettings,
  } = useAppStore();

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoSettings({ baseVideo: file });
    }
  };

  const handleDurationChange = (duration: 30 | 60) => {
    setVideoSettings({ duration });
  };

  const handleResolutionChange = (resolution: '1080p' | '4K') => {
    setVideoSettings({ resolution });
  };

  const handleAudioToggle = () => {
    setVideoSettings({ audioEnabled: !videoSettings.audioEnabled });
  };

  return (
    <div className="space-y-6">
      <h3 className="section-title">Video Settings</h3>

      {/* Video Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Background Video
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 cursor-pointer transition-colors"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {videoSettings.baseVideo ? videoSettings.baseVideo.name : 'Click to upload video'}
          </p>
          <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
        />
      </div>

      {/* Duration Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Video Duration
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleDurationChange(30)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              videoSettings.duration === 30
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium">30 seconds</div>
            <div className="text-sm text-gray-500">Short format</div>
          </button>
          <button
            onClick={() => handleDurationChange(60)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              videoSettings.duration === 60
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium">60 seconds</div>
            <div className="text-sm text-gray-500">Long format</div>
          </button>
        </div>
      </div>

      {/* Resolution Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Export Resolution
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleResolutionChange('1080p')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              videoSettings.resolution === '1080p'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium">1080p</div>
            <div className="text-sm text-gray-500">1920 × 1080</div>
          </button>
          <button
            onClick={() => handleResolutionChange('4K')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              videoSettings.resolution === '4K'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium">4K</div>
            <div className="text-sm text-gray-500">3840 × 2160</div>
          </button>
        </div>
      </div>

      {/* Audio Toggle */}
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={videoSettings.audioEnabled}
            onChange={handleAudioToggle}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Include audio from video
          </span>
        </label>
      </div>

      {/* Video Preview - COMMENTED OUT TO PREVENT FLICKERING */}
      {/* {videoSettings.baseVideo && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Video Preview
          </label>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              src={URL.createObjectURL(videoSettings.baseVideo)}
              controls
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default VideoControls;

