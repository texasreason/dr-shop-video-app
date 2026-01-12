import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../contexts/AppStore';
import { X, Download } from 'lucide-react';

interface FullResolutionPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullResolutionPreview: React.FC<FullResolutionPreviewProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    videoSettings,
    backgroundImage,
    overlayText,
    qrCode,
    colorOverlay,
    logo,
    products,
  } = useAppStore();

  if (!isOpen) return null;

  // Full resolution positioning (1920x1080)
  const videoXPosition = 75; // px from left edge
  const videoYPosition = 170; // px from top
  const videoWidth = 1137; // px width - Corrected width
  const videoHeight = 640; // px height - Corrected height
  // Logo uses full resolution size with scale percentage applied (2x base size)
  const logoWidth = logo.width * (logo.scale / 100) * 2;
  const logoHeight = logo.height * (logo.scale / 100) * 2;
  const logoXPosition = videoXPosition + logo.position.x;
  const logoYPosition = videoYPosition + videoHeight + 40 + logo.position.y;
  
  // Product carousel positioning (show first product if any exist)
  const currentProduct = products.length > 0 ? 0 : null;

  // Color overlay calculations using pixel positioning for 1920x1080 canvas
  const originalCanvasWidth = 1920;

  const getOverlayPosition = () => {
    switch (colorOverlay.position) {
      case 'left':
        return 0;
      case 'right':
        return originalCanvasWidth - 600; // Fixed 600px width
      case 'center':
        return (originalCanvasWidth - 600) / 2; // Fixed 600px width
      default:
        return originalCanvasWidth - 600; // Fixed 600px width, default to right
    }
  };

  // Product carousel positioning - same logic as preview but larger
  const colorOverlayLeft = getOverlayPosition();
  const productCarouselWidth = 450; // Increased width for larger content
  const availableOverlayWidth = 600; // Fixed 600px width
  const overlayCenter = colorOverlayLeft + (availableOverlayWidth / 2);
  const productCarouselLeft = colorOverlay.visible ? 
    overlayCenter - (productCarouselWidth / 2) : 
    originalCanvasWidth - productCarouselWidth - 50; // Fallback: right side with margin

  const downloadAsJPG = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to 1920x1080
    canvas.width = 1920;
    canvas.height = 1080;

    try {
      // Clear canvas
      ctx.clearRect(0, 0, 1920, 1080);

      // Draw background image if exists
      if (backgroundImage.url) {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          bgImg.onload = resolve;
          bgImg.onerror = reject;
          bgImg.src = backgroundImage.url!;
        });
        
        ctx.globalAlpha = backgroundImage.opacity;
        ctx.drawImage(bgImg, 0, 0, 1920, 1080);
        ctx.globalAlpha = 1;

        // Draw gradient overlay if enabled
        if (backgroundImage.gradient.enabled) {
          const gradient = ctx.createLinearGradient(0, 1080, 0, 540);
          gradient.addColorStop(0, backgroundImage.gradient.color);
          gradient.addColorStop(1, 'transparent');
          
          ctx.globalAlpha = backgroundImage.gradient.opacity;
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 540, 1920, 540);
          ctx.globalAlpha = 1;
        }
      }

      // Draw color overlay if visible
      if (colorOverlay.visible) {
        ctx.globalAlpha = colorOverlay.opacity;
        ctx.fillStyle = colorOverlay.color;
        
        if (colorOverlay.floatingStyle) {
          // Draw rounded rectangle with shadow for floating style
          const x = 1920 - 620 - 10; // Right-aligned with 10px margin
          const y = 10; // 10px margin from top
          const width = 620; // Increased by 20px (10px each side)
          const height = 1060; // Increased by 20px (10px each side)
          const radius = 40;
          
          // Draw shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 30;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 10;
          
          // Draw rounded rectangle
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();
          
          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        } else {
          // Draw regular rectangle
          ctx.fillRect(getOverlayPosition(), 0, 600, 1080);
        }
        
        ctx.globalAlpha = 1;
      }

      // Draw video placeholder (gray rectangle)
      ctx.fillStyle = '#4B5563';
      ctx.fillRect(videoXPosition, videoYPosition, videoWidth, videoHeight);
      
      // Draw "VIDEO" text on placeholder
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('VIDEO', videoXPosition + videoWidth/2, videoYPosition + videoHeight/2);

      // Draw independent QR code if visible (outside of product showcase)
      if (qrCode.visible && qrCode.url) {
        try {
          const qrImg = new Image();
          qrImg.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            qrImg.onload = resolve;
            qrImg.onerror = reject;
            qrImg.src = qrCode.url!;
          });
          
          const qrSize = 188;
          const qrX = overlayCenter - (qrSize / 2);
          const qrY = 1080 - 50 - qrSize - 60; // Bottom positioning with text space
          
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
          
          // Draw "SHOP NOW" text
          ctx.fillStyle = '#111827';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('SHOP NOW', overlayCenter, qrY + qrSize + 20);
          
          // Draw QR code description
          ctx.fillStyle = '#6B7280';
          ctx.font = '14px Arial';
          ctx.fillText('Scan QR code to shop all the products', overlayCenter, qrY + qrSize + 40);
        } catch (error) {
          console.warn('Failed to load QR code image for canvas:', error);
        }
      }

      // Draw logo if exists
      if (logo.visible && logo.url) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
          logoImg.src = logo.url!;
        });
        
        ctx.drawImage(logoImg, logoXPosition, logoYPosition, logoWidth, logoHeight);

        // Draw vertical divider line if text is also visible
        if (overlayText.visible) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(logoXPosition + logoWidth + 50, logoYPosition, 3, Math.max(logoHeight, 48));
        }
      }

      // Draw text if visible
      if (overlayText.visible) {
        ctx.fillStyle = overlayText.color;
        ctx.font = '40px "Helvetica Neue", Arial, sans-serif';
        ctx.textAlign = 'left';
        
        const textX = logo.visible && logo.url ? 
          logoXPosition + logoWidth + 50 + 3 + 50 : // After logo + divider + padding
          logoXPosition; // Just at logo position if no logo
          
        // Handle text wrapping
        const words = overlayText.content.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 700) {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);

        lines.forEach((line, index) => {
          ctx.fillText(line, textX, logoYPosition + 40 + (index * 48));
        });
      }

      // Draw product showcase if exists
      if (currentProduct !== null && products[currentProduct]) {
        const productShowcaseY = 50; // Position 50px from top of canvas
        const baseProductX = colorOverlay.floatingStyle ? (1920 - 620 - 10) : (colorOverlay.visible ? colorOverlayLeft : 1920 - 600); // Match overlay position
        const rightShift = colorOverlay.floatingStyle ? 40 : 0; // Move 30px right (10px centering + 30px shift)
        const productShowcaseX = baseProductX + rightShift + 16; // Add shift and padding offset
        const productShowcaseWidth = 600 - 32; // Account for padding on both sides
        
        // Draw product showcase background (white rounded rectangle)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(productShowcaseX, productShowcaseY, productShowcaseWidth, 800); // Increased height from 600 to 800
        
        let currentY = productShowcaseY + 40; // Increased start position for content from 20 to 40
        
        // Draw product image if exists
        if (products[currentProduct].imageUrl) {
          const productImg = new Image();
          productImg.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            productImg.onload = resolve;
            productImg.onerror = reject;
            productImg.src = products[currentProduct].imageUrl!;
          });
          
          const imageSize = 380;
          const imageX = productShowcaseX + (productShowcaseWidth - imageSize) / 2;
          ctx.drawImage(productImg, imageX, currentY, imageSize, imageSize);
          currentY += imageSize + 40; // Increased spacing from 20 to 40 between image and text
        }
        
        // Draw product title
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(products[currentProduct].title, productShowcaseX + productShowcaseWidth / 2, currentY);
        currentY += 45;
        
        // Draw secondary text
        ctx.fillStyle = '#6B7280';
        ctx.font = '18px Arial';
        ctx.fillText(products[currentProduct].secondaryCopy, productShowcaseX + productShowcaseWidth / 2, currentY);
        currentY += 30;
        
        // Draw description
        ctx.fillStyle = '#374151';
        ctx.font = '16px Arial';
        ctx.fillText(products[currentProduct].description, productShowcaseX + productShowcaseWidth / 2, currentY);
        currentY += 40;
        
        // Draw price
        ctx.fillStyle = '#EA580C';
        ctx.font = 'bold 30px Arial';
        ctx.fillText(`$${products[currentProduct].price.replace('$', '')}`, productShowcaseX + productShowcaseWidth / 2, currentY);
        currentY += 70; // Added 20px more spacing before QR code
        
        // Draw QR code within product showcase if visible
        if (qrCode.visible && qrCode.url) {
          const qrImg = new Image();
          qrImg.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            qrImg.onload = resolve;
            qrImg.onerror = reject;
            qrImg.src = qrCode.url!;
          });
          
          const qrSize = 188;
          const qrX = productShowcaseX + (productShowcaseWidth - qrSize) / 2;
          ctx.drawImage(qrImg, qrX, currentY, qrSize, qrSize);
          currentY += qrSize + 15;
          
          // Draw "SHOP NOW" text
          ctx.fillStyle = '#111827';
          ctx.font = 'bold 16px Arial';
          ctx.fillText('SHOP NOW', productShowcaseX + productShowcaseWidth / 2, currentY);
          currentY += 25;
          
          // Draw QR code description
          ctx.fillStyle = '#6B7280';
          ctx.font = '14px Arial';
          ctx.fillText('Scan QR code to shop all the products', productShowcaseX + productShowcaseWidth / 2, currentY);
        }
      }

      // Convert to JPG and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `video-creative-1920x1080-${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/jpeg', 0.95);

    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-2xl w-full h-full overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Actual 1920×1080 Preview
            </h3>
            <p className="text-sm text-gray-600">
              True 1:1 scale - exactly as it will appear in the final export
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadAsJPG}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download JPG</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Full Resolution Canvas Preview */}
        <div className="p-6 overflow-auto">
          <div className="mx-auto">
            <div
              className="relative bg-black border border-gray-300 overflow-hidden mx-auto"
              style={{
                width: '1920px', // Actual full resolution width
                height: '1080px', // Actual full resolution height
              }}
            >
              {/* Background Image */}
              {backgroundImage.url && (
                <>
                  <img
                    src={backgroundImage.url}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: backgroundImage.opacity }}
                  />
                  {/* Bottom gradient overlay - 540px height, bottom aligned */}
                  {backgroundImage.gradient.enabled && (
                    <div
                      className="absolute bottom-0 left-0"
                      style={{
                        width: '1920px',
                        height: '540px', // Half of 1080px
                        background: `linear-gradient(to top, ${backgroundImage.gradient.color} 0%, transparent 100%)`,
                        opacity: backgroundImage.gradient.opacity,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </>
              )}

              {/* Color Overlay - Fixed 600px width */}
              {colorOverlay.visible && (
                <div
                  className={`absolute top-0 ${
                    colorOverlay.floatingStyle ? 'rounded-3xl shadow-2xl' : ''
                  }`}
                  style={{
                    backgroundColor: colorOverlay.color,
                    opacity: colorOverlay.opacity,
                    width: colorOverlay.floatingStyle ? '620px' : '600px', // Increased by 20px (10px each side) when floating
                    height: colorOverlay.floatingStyle ? '1060px' : '1080px', // Increased by 20px (10px each side) when floating
                    right: colorOverlay.floatingStyle ? '10px' : '0px', // 10px margin from right when floating
                    left: colorOverlay.floatingStyle ? 'auto' : `${getOverlayPosition()}px`, // Use right positioning when floating
                    top: colorOverlay.floatingStyle ? '10px' : '0px', // 10px margin from top when floating
                    zIndex: 0,
                  }}
                />
              )}

              {/* QR Code is integrated into the product showcase */}

              {/* Main Video Area */}
              {videoSettings.baseVideo && (
                <div
                  className="absolute border-2 border-red-400 bg-gray-800 flex items-center justify-center"
                  style={{
                    left: `${videoXPosition}px`,
                    top: `${videoYPosition}px`,
                    width: `${videoWidth}px`,
                    height: `${videoHeight}px`,
                    zIndex: 1,
                  }}
                >
                  <div className="text-center text-red-400">
                    <div className="text-lg font-bold mb-1">VIDEO</div>
                    <div className="text-xs">
                      {videoWidth} × {videoHeight}px
                    </div>
                    <div className="text-xs">
                      Position: {videoXPosition}, {videoYPosition}
                    </div>
                  </div>
                </div>
              )}


              {/* Product Showcase - Centered in Color Overlay */}
              {currentProduct !== null && products[currentProduct] && (
                <div
                  className="absolute h-full flex flex-col items-center justify-start"
                  style={{
                    right: colorOverlay.floatingStyle ? '-10px' : '0', // Move 30px right from centered position: 20 - 30 = -10px
                    width: '600px', // Match color overlay width
                    top: colorOverlay.floatingStyle ? '10px' : '0', // 10px top margin when floating
                    height: '1080px',
                    padding: '50px 40px',
                    zIndex: 4,
                  }}
                >
                  {/* Product Image - Centered at top */}
                  {products[currentProduct].imageUrl && (
                    <div className="w-full flex justify-center" style={{ marginBottom: '36px' }}>
                      <img
                        src={products[currentProduct].imageUrl}
                        alt={products[currentProduct].title}
                        className="object-contain"
                        style={{
                          maxWidth: '480px',
                          maxHeight: '380px',
                          height: 'auto',
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Product Information - Below image */}
                  <div className="text-center w-full" style={{ padding: '0 30px' }}>
                    <h3 
                      style={{
                        fontSize: '68px',
                        fontWeight: '900',
                        marginBottom: '12px',
                        lineHeight: '1.1',
                        color: '#000000',
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {products[currentProduct].title}
                    </h3>
                    <p 
                      style={{
                        fontSize: '42px',
                        fontWeight: '500',
                        marginBottom: '10px',
                        lineHeight: '1.3',
                        color: '#000000',
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
                      }}
                    >
                      {products[currentProduct].secondaryCopy}
                    </p>
                    <p 
                      style={{
                        fontSize: '26px',
                        fontWeight: '400',
                        marginBottom: '28px',
                        lineHeight: '1.4',
                        color: '#666666',
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
                      }}
                    >
                      {products[currentProduct].description}
                    </p>
                    <p 
                      style={{
                        fontSize: '72px',
                        fontWeight: '900',
                        marginTop: '28px',
                        marginBottom: '50px',
                        lineHeight: '1',
                        color: '#000000',
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
                      }}
                    >
                      ${products[currentProduct].price.replace('$', '')}
                    </p>
                  </div>

                  {/* QR Code at bottom of product card */}
                  {qrCode.visible && qrCode.url && (
                    <div className="mt-auto w-full flex flex-col items-center justify-center" style={{ padding: '0 40px' }}>
                      <img
                        src={qrCode.url}
                        alt="QR Code"
                        style={{
                          width: '200px',
                          height: '200px',
                          objectFit: 'contain',
                          marginBottom: '16px',
                          display: 'block'
                        }}
                      />
                      <p 
                        style={{
                          fontSize: '22px',
                          fontWeight: '700',
                          marginBottom: '8px',
                          color: '#000000',
                          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                          letterSpacing: '0.05em',
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        SHOP NOW
                      </p>
                      <p 
                        style={{
                          fontSize: '16px',
                          fontWeight: '400',
                          color: '#666666',
                          lineHeight: '1.3',
                          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        Scan QR code to shop all the products
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Logo + Text Module */}
              {(logo.visible && logo.url) || overlayText.visible ? (
                <div
                  className="absolute flex items-start border-2 border-blue-400"
                  style={{
                    left: `${logoXPosition}px`,
                    top: `${logoYPosition}px`,
                    zIndex: 2,
                    minHeight: '50px',
                    padding: '8px',
                  }}
                >
                  {/* Logo */}
                  {logo.visible && logo.url && (
                    <img
                      src={logo.url}
                      alt="Logo"
                      className="border border-purple-400"
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
                  
                  {/* Text */}
                  {overlayText.visible && (
                    <div
                      className="text-white font-bold border border-yellow-400"
                      style={{
                        fontSize: '40px', // Full 40pt size
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        color: overlayText.color,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        lineHeight: '1.2',
                        paddingTop: '0',
                        maxWidth: '700px',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        padding: '4px',
                      }}
                    >
                      {overlayText.content}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Dimension indicators */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                Canvas: 1920 × 1080px
              </div>
              
              {/* Grid overlay for reference */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                {/* Vertical grid lines every 192px (10% of 1920) */}
                {Array.from({ length: 11 }, (_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-white"
                    style={{ left: `${i * 10}%` }}
                  />
                ))}
                {/* Horizontal grid lines every 108px (10% of 1080) */}
                {Array.from({ length: 11 }, (_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 h-px bg-white"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Element Information */}
          <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Element Positions</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Video:</span>
                  <span className="font-mono">
                    {videoXPosition}px, {videoYPosition}px ({videoWidth} × {videoHeight}px)
                  </span>
                </div>
                {currentProduct !== null && products[currentProduct] && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Showcase:</span>
                    <span className="font-mono">
                      {productCarouselLeft}px, 0px ({productCarouselWidth} × 1080px)
                    </span>
                  </div>
                )}
                {logo.visible && logo.url && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Logo:</span>
                    <span className="font-mono">
                      {logoXPosition}px, {logoYPosition}px ({logoWidth} × {logoHeight}px) at {logo.scale}%
                    </span>
                  </div>
                )}
                {overlayText.visible && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Text:</span>
                    <span className="font-mono">
                      {logoXPosition + (logo.visible && logo.url ? logoWidth + 32 : 0)}px, {logoYPosition}px (40pt font)
                    </span>
                  </div>
                )}
                {colorOverlay.visible && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color Overlay:</span>
                    <span className="font-mono">
                      {getOverlayPosition()}px, 0px ({colorOverlay.width} × {colorOverlay.height}px)
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-red-400"></div>
                  <span>Video Area</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-orange-400"></div>
                  <span>Product Showcase</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-400"></div>
                  <span>Logo + Text Module</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-purple-400"></div>
                  <span>Logo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div style={{ width: '3px', height: '16px', backgroundColor: '#ffffff', opacity: 1 }}></div>
                  <span>Vertical Divider</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-yellow-400"></div>
                  <span>Text Area</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-green-400"></div>
                  <span>QR Code</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </motion.div>
    </div>
  );
};

export default FullResolutionPreview;
