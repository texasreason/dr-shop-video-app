import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../contexts/AppStore';
import { Play, Pause, Square, Download, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import ExportControls from './ExportControls';
import ProductVideoLayer from './ProductVideoLayer';

const PreviewPanel: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    videoSettings,
    backgroundImage,
    overlayText,
    qrCode,
    colorOverlay,
    logo,
    products,
    isPreviewPlaying,
    previewTime,
    isPreviewMuted,
    setIsPreviewPlaying,
    setPreviewTime,
    setIsPreviewMuted,
    setVideoSettings,
  } = useAppStore();



  // Video event handlers and scrubber sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      console.log('⏰ Time update:', video.currentTime);
      setPreviewTime(video.currentTime);
    };

    const handleEnded = () => {
      console.log('🏁 Video ended naturally - resetting to beginning');
      setIsPreviewPlaying(false);
      setPreviewTime(0);
      video.currentTime = 0;
    };

    const handleLoadedData = () => {
      console.log('📺 Video loaded, duration:', video.duration);
      // Update the video duration in the store
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        console.log('🔄 Updating video duration in store to:', video.duration);
        setVideoSettings({ duration: Number(video.duration) });
      }
    };

    const handlePlay = () => {
      console.log('🎬 Video started playing (native event)');
      setIsPreviewPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Video paused (native event) - currentTime:', video.currentTime);
      setIsPreviewPlaying(false);
      // DO NOT reset time here - just update state
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [setPreviewTime, setIsPreviewPlaying, setVideoSettings]);

  // Fallback scrubber sync - ensures scrubber moves even if timeupdate events are inconsistent
  useEffect(() => {
    let animationFrame: number;
    
    const syncScrubber = () => {
      const video = videoRef.current;
      if (video && !video.paused && !video.ended) {
        // Only update if the video is actually playing and time has changed
        if (Math.abs(video.currentTime - previewTime) > 0.05) {
          console.log('🔄 Fallback sync: updating scrubber to', video.currentTime);
          setPreviewTime(video.currentTime);
        }
        animationFrame = requestAnimationFrame(syncScrubber);
      }
    };

    if (isPreviewPlaying) {
      console.log('🎬 Starting fallback scrubber sync');
      animationFrame = requestAnimationFrame(syncScrubber);
    }

    return () => {
      if (animationFrame) {
        console.log('🛑 Stopping fallback scrubber sync');
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPreviewPlaying, previewTime, setPreviewTime]);

  // Sync video muted state when isPreviewMuted changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isPreviewMuted;
      console.log('🔊 Video muted state synced:', isPreviewMuted);
    }
  }, [isPreviewMuted]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    console.log('🔘 handlePlayPause called');
    
    if (!video) {
      console.error('❌ No video element found!');
      return;
    }

    console.log('🎥 Video actual state:', {
      paused: video.paused,
      currentTime: video.currentTime,
      duration: video.duration,
      readyState: video.readyState
    });
    console.log('🎬 React state isPreviewPlaying:', isPreviewPlaying);

    // Use ACTUAL video state instead of React state
    if (video.paused) {
      console.log('▶️ Video is paused, attempting to play');
      video.play()
        .then(() => {
          console.log('✅ Video play successful');
          setIsPreviewPlaying(true);
        })
        .catch(e => {
          console.error('❌ Video play failed:', e);
          setIsPreviewPlaying(false);
        });
    } else {
      console.log('⏸️ Video is playing, attempting to pause (NOT RESET)');
      // Just pause, don't reset time
      video.pause();
      console.log('⏸️ Video paused at time:', video.currentTime);
      setIsPreviewPlaying(false);
    }
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (video) {
      console.log('🎯 Seeking to:', time);
      video.currentTime = time;
      setPreviewTime(time);
    }
  };

  const handleReset = () => {
    const video = videoRef.current;
    if (video) {
      console.log('🔄 RESET BUTTON CLICKED - Resetting video');
      video.pause();
      video.currentTime = 0;
      setPreviewTime(0);
      setIsPreviewPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (video) {
      const newMutedState = !isPreviewMuted;
      console.log('🔊 Toggling mute:', newMutedState ? 'MUTED' : 'UNMUTED');
      video.muted = newMutedState;
      setIsPreviewMuted(newMutedState);
    }
  };

  // Create stable video URL to prevent recreation
  const videoUrl = React.useMemo(() => {
    if (videoSettings.baseVideo) {
      const url = URL.createObjectURL(videoSettings.baseVideo);
      console.log('🎬 Created new video URL:', url);
      return url;
    }
    return null;
  }, [videoSettings.baseVideo]);

  // Cleanup URL when component unmounts or video changes
  React.useEffect(() => {
    return () => {
      if (videoUrl) {
        console.log('🗑️ Cleaning up video URL:', videoUrl);
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Calculate scale factor to fit 1920x1080 in the preview container
  const previewScale = 0.4;

  const renderOverlay = () => {
    // All positioning based on 1920x1080 canvas (will be scaled down in preview)
    const videoXPosition = 75; // px from left edge (1920x1080 coordinates)
    const videoYPosition = 170; // px from top (1920x1080 coordinates)
    const videoWidth = 1137; // px width (1920x1080 size) - Corrected width
    const videoHeight = 640; // px height (1920x1080 size) - Corrected height
    // Logo uses full resolution size with scale percentage applied (2x base size)
    const logoWidth = logo.width * (logo.scale / 100) * 2;
    const logoHeight = logo.height * (logo.scale / 100) * 2;
    const logoXPosition = videoXPosition + logo.position.x;
    const logoYPosition = videoYPosition + videoHeight + 40 + logo.position.y;
        
        // Scale the gradient height proportionally for the preview
        const scaledGradientHeight = 540 * previewScale; // 540px * preview scale
    
    // Color overlay calculations using pixel positioning for 1920x1080 canvas
    const originalCanvasWidth = 1920;
    
    // Calculate position based on alignment (in pixels)
    const getOverlayPosition = () => {
      switch (colorOverlay.position) {
        case 'left':
          return 0;
        case 'right':
          return originalCanvasWidth - 600; // Fixed 600px width, right-aligned
        case 'center':
          return (originalCanvasWidth - 600) / 2; // Fixed 600px width, center-aligned
        default:
          return originalCanvasWidth - 600; // Fixed 600px width, default to right
      }
    };

    // Use exact same positioning as 1920×1080, then scale down
    const fullResColorOverlayLeft = getOverlayPosition();
    const fullResProductCarouselWidth = 450; 
    const fullResAvailableOverlayWidth = 600; // Fixed 600px width
    const fullResOverlayCenter = fullResColorOverlayLeft + (fullResAvailableOverlayWidth / 2);
    
    // Better centering calculation - adjust for preview centering
    const fullResProductCarouselLeft = colorOverlay.visible ? 
      fullResColorOverlayLeft + (fullResAvailableOverlayWidth - fullResProductCarouselWidth) / 2 + 75 - 6 : // Moved 6px left total
      originalCanvasWidth - fullResProductCarouselWidth - 50;
    
    // Scale everything down for preview
    const productCarouselWidth = fullResProductCarouselWidth * previewScale;
    const productCarouselLeft = fullResProductCarouselLeft * previewScale;

    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Color Overlay - positioned outside scaled container with exact positioning */}
        {colorOverlay.visible && (
          <div
            className="absolute top-0 transition-all duration-300"
            style={{
              backgroundColor: colorOverlay.color,
              opacity: colorOverlay.opacity,
              width: `${(600 / 1920) * 100}%`, // 600px as percentage of 1920px = 31.25%
              height: '100%', // Full height of preview container
              right: '0%', // Always right-aligned to match 1920x1080
              zIndex: 0,
            }}
          />
        )}

        {/* Scaled overlay container for all positioned elements */}
        <div
          style={{
            width: '1920px',
            height: '1080px',
            transformOrigin: 'top left',
            transform: `scale(${previewScale})`,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {/* Products and other overlays will be here */}



          {/* Independent QR Code - Separate from product module */}
          {qrCode.visible && qrCode.url && (
            <div
              className="absolute text-center"
              style={{
                left: `${fullResOverlayCenter - 44}px`, // Positioned in color overlay
                bottom: '50px', // Full resolution positioning
                zIndex: 4,
              }}
            >
              <img
                src={qrCode.url}
                alt="QR Code"
                className="mx-auto"
                style={{
                  width: '188px', // Full resolution size
                  height: '188px', // Full resolution size
                  marginBottom: '12px' // Full resolution margin
                }}
              />
              <p 
                className="font-bold text-gray-900"
                style={{ 
                  fontSize: '16px', // Full resolution font size
                  marginBottom: '4px'
                }}
              >
                SHOP NOW
              </p>
              <p 
                className="text-gray-600"
                style={{ 
                  fontSize: '14px' // Full resolution font size
                }}
              >
                Scan QR code to shop all the products
              </p>
            </div>
          )}

          {/* Product rendering handled by ProductVideoLayer */}
          <ProductVideoLayer 
            currentTime={previewTime}
            isPlaying={isPreviewPlaying}
            videoDuration={videoSettings.duration}
          />

          {/* Logo + Text Module - positioned below video */}
          {(logo.visible && logo.url) || overlayText.visible ? (
            <div
              className="absolute flex items-start"
              style={{
                left: `${logoXPosition}px`, // Logo x position with offset
                top: `${logoYPosition}px`, // Logo y position with offset
                zIndex: 2,
              }}
            >
              {/* Logo on the left (only show if uploaded) */}
              {logo.visible && logo.url && (
                <img
                  src={logo.url}
                  alt="Logo"
                  style={{
                    width: `${logoWidth}px`, // Full resolution size
                    height: `${logoHeight}px`, // Full resolution size
                    objectFit: 'contain',
                    flexShrink: 0,
                  }}
                />
              )}
              
              {/* Vertical divider line (only show if both logo and text are visible) */}
              {logo.visible && logo.url && overlayText.visible && (
                <div
                  style={{
                    marginLeft: '50px',
                    marginRight: '50px',
                    width: '3px',
                    height: `${Math.max(logoHeight, 48)}px`, // Match logo height or minimum 48px
                    backgroundColor: '#ffffff',
                    opacity: 1,
                    flexShrink: 0,
                  }}
                />
              )}
              
              {/* Text on the right, aligned to top */}
              {overlayText.visible && (
                <div
                  className="text-white font-bold"
                  style={{
                    fontSize: '40px', // Full resolution font size
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    color: overlayText.color,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    lineHeight: '1.2',
                    paddingTop: '0', // Align to top of module
                         maxWidth: '700px', // Full resolution max width
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    marginLeft: logo.visible && logo.url ? '0' : '0', // No additional margin since divider handles spacing
                  }}
                >
                  {overlayText.content}
                </div>
              )}
            </div>
          ) : null}



          {/* Current Product - REMOVE OLD DUPLICATE VERSION */}
        </div> {/* Close scaled overlay container */}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Preview</h3>
        <ExportControls isExporting={isExporting} setIsExporting={setIsExporting} />
      </div>

      {/* Video Preview */}
      <div className="space-y-4">
        <div className="relative bg-black overflow-hidden group rounded-lg">
          <div className="relative aspect-video">
            {/* Background Image - behind everything */}
            {backgroundImage.url && (
              <div className="absolute inset-0" style={{ zIndex: 0 }}>
                <img
                  src={backgroundImage.url}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: backgroundImage.opacity }}
                />
                {/* Bottom gradient overlay */}
                {backgroundImage.gradient.enabled && (
                  <div
                    className="absolute bottom-0 left-0 w-full"
                    style={{
                      height: `${540 * 0.4}px`, // Scaled for preview size
                      background: `linear-gradient(to top, ${backgroundImage.gradient.color} 0%, transparent 100%)`,
                      opacity: backgroundImage.gradient.opacity,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>
            )}

            {/* Main video - TESTING CUSTOM CONTROLS ONLY */}
            {videoUrl && (
              <video
                ref={videoRef}
                src={videoUrl}  // Use stable URL instead of recreating
                className="absolute object-cover"
                muted={isPreviewMuted}  // Controlled by user preference, defaults to muted
                preload="auto"
                playsInline
                controls={false}  // ← DISABLE NATIVE CONTROLS TO TEST CUSTOM ONLY
                onLoadStart={() => console.log('🎥 Video loadStart')}
                onLoadedData={() => console.log('🎥 Video loadedData - duration:', videoRef.current?.duration)}
                onCanPlay={() => console.log('🎥 Video canPlay')}
                onError={(e) => console.log('🎥 Video error:', e)}
                onPlay={() => console.log('🎬 Video onPlay event - currentTime:', videoRef.current?.currentTime)}
                onPause={() => console.log('⏸️ Video onPause event')}
                onTimeUpdate={() => console.log('⏰ Video timeUpdate:', videoRef.current?.currentTime)}
                style={{ 
                  left: `${75 * previewScale}px`,
                  top: `${170 * previewScale}px`,
                  width: `${1137 * previewScale}px`,
                  height: `${640 * previewScale}px`,
                  zIndex: 1,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 6px 10px rgba(0, 0, 0, 0.15)'
                }}
              />
            )}
            
            {!videoSettings.baseVideo && (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🎥</div>
                  <p>Upload a video to see preview</p>
                </div>
              </div>
            )}
            
            {/* Overlay Elements (Text, Logo, Divider) - pointer-events-none only for overlays */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
              {renderOverlay()}
            </div>

            {/* Debug info overlay - HIDDEN FOR PRODUCTION */}
            {/* <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded z-50 text-sm">
              <div>🎥 Video File: {videoSettings.baseVideo ? '✅ Loaded' : '❌ None'}</div>
              <div>⏰ Current Time: {previewTime.toFixed(2)}s</div>
              <div>🎬 Playing: {isPreviewPlaying ? '✅ YES' : '❌ NO'}</div>
              <div>📺 Duration: {videoSettings.duration}s</div>
              <div>🔊 Audio: {videoSettings.audioEnabled ? 'ON' : 'OFF'}</div>
              
              <button 
                onClick={() => {
                  const video = videoRef.current;
                  if (video) {
                    console.log('🧪 DIRECT TEST: Calling video.play()');
                    console.log('🧪 DIRECT TEST: Video paused before:', video.paused);
                    video.play()
                      .then(() => {
                        console.log('🧪 DIRECT TEST: Success!');
                        console.log('🧪 DIRECT TEST: Video paused after:', video.paused);
                        console.log('🧪 DIRECT TEST: React state isPreviewPlaying:', isPreviewPlaying);
                      })
                      .catch(e => console.log('🧪 DIRECT TEST: Failed:', e));
                  }
                }}
                className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs"
              >
                🧪 DIRECT PLAY TEST
              </button>
            </div> */}
          </div>
        </div>

        {/* Video Controls - Now separate from video preview */}
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔘 CUSTOM PLAY BUTTON CLICKED!');
                console.log('🎥 Video ref:', videoRef.current);
                console.log('🎬 Video paused?', videoRef.current?.paused);
                console.log('🎯 About to call handlePlayPause...');
                handlePlayPause();
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            >
              {/* Use React state for icon - should sync with video events */}
              {isPreviewPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={handleReset}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
              title="Reset video to beginning"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={handleMuteToggle}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
              title={isPreviewMuted ? "Unmute audio" : "Mute audio"}
            >
              {isPreviewMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>

            <div className="flex-1 mx-4">
              <input
                type="range"
                min="0"
                max={videoSettings.duration}
                step="0.1"
                value={previewTime}
                onChange={(e) => {
                  console.log('🎯 Scrubber moved to:', e.target.value);
                  handleSeek(Number(e.target.value));
                }}
                className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="text-white text-sm">
              {Math.floor(previewTime / 60)}:{(previewTime % 60).toFixed(1).padStart(4, '0')} / 
              {Math.floor(videoSettings.duration / 60)}:{(videoSettings.duration % 60).toFixed(1).padStart(4, '0')}
            </div>

          </div>
        </div>
      </div>

      {/* Product Timeline */}
      {products.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Product Timeline</h4>
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center space-x-3 p-2 rounded-lg transition-colors bg-gray-50 hover:bg-gray-100"
              >
                <div className="w-3 h-3 rounded-full bg-primary-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.timing.startTime.toFixed(1)}s - {(product.timing.startTime + product.timing.duration).toFixed(1)}s
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  {product.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Status */}
      {isExporting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-800">Exporting video... This may take a few minutes.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
