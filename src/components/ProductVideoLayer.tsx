import React from 'react';
import { useAppStore } from '../contexts/AppStore';

interface ProductVideoLayerProps {
  currentTime: number;
  isPlaying: boolean;
  videoDuration: number;
}

const ProductVideoLayer: React.FC<ProductVideoLayerProps> = ({
  currentTime,
  isPlaying,
  videoDuration
}) => {
  const { products, colorOverlay, qrCode } = useAppStore();
  
  // Preview scale to match the main video
  const previewScale = 1.4; // Increased to 2x from 0.7 (doubled)

  // Find the active product for current time
  const activeProduct = products.find(product => 
    currentTime >= product.timing.startTime && 
    currentTime < product.timing.startTime + product.timing.duration
  );

  // Calculate color overlay position in preview (scaled to match PreviewPanel)
  const getOverlayPosition = () => {
    const originalCanvasWidth = 1920;
    switch (colorOverlay.position) {
      case 'left':
        return 0;
      case 'right':
        return originalCanvasWidth - 600; // Fixed 600px width
      case 'center':
        return (originalCanvasWidth - 600) / 2;
      default:
        return originalCanvasWidth - 600; // Default to right
    }
  };

  // Position product module over the color overlay area with debug scaling
  const baseScale = 0.4; // Base preview scale to match video preview scaling
  const colorOverlayLeft = getOverlayPosition() * baseScale;
  const colorOverlayWidth = 600 * baseScale;
  const productModuleWidth = 300;
  // Move to the right side where color overlay is positioned
  const productModuleLeft = colorOverlayLeft + 50; // Position within color overlay area

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
      {/* Product Showcase - Synchronized with video time */}
      {activeProduct && (
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: `${productModuleLeft}px`,
            width: `${productModuleWidth}px`,
            top: `${30}px`, // Fixed top position for visibility
            padding: `${10}px`,
            zIndex: 25,
            border: '2px solid red', // Debug border to see if it's visible
          }}
        >
          {/* Product content without background */}
          <div 
            className="p-6 text-center"
            style={{
              width: '100%',
              minHeight: `${200}px`, // Fixed height for debugging
              backgroundColor: 'rgba(255, 255, 255, 0.9)' // Temporary background to see it
            }}
          >
            {/* Product image */}
            {activeProduct.imageUrl && (
              <div 
                className="text-center"
                style={{ marginBottom: `${16 * previewScale}px` }}
              >
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.title}
                  className="object-contain mx-auto"
                  style={{
                    width: `${380 * previewScale}px`,
                    height: `${380 * previewScale}px`
                  }}
                />
              </div>
            )}
            
            {/* Product information */}
            <div className="text-center">
              <h3 
                className="font-bold text-gray-900"
                style={{ 
                  fontSize: `${48 * previewScale}px`,
                  marginBottom: `${8 * previewScale}px`,
                  lineHeight: '1.1'
                }}
              >
                {activeProduct.title}
              </h3>
              
              {activeProduct.secondaryCopy && (
                <p 
                  className="text-gray-600"
                  style={{ 
                    fontSize: `${24 * previewScale}px`,
                    marginBottom: `${6 * previewScale}px`,
                    lineHeight: '1.2'
                  }}
                >
                  {activeProduct.secondaryCopy}
                </p>
              )}
              
              {activeProduct.description && (
                <p 
                  className="text-gray-700"
                  style={{ 
                    fontSize: `${20 * previewScale}px`,
                    marginBottom: `${10 * previewScale}px`,
                    lineHeight: '1.2'
                  }}
                >
                  {activeProduct.description}
                </p>
              )}
              
              <p 
                className="font-bold text-orange-500"
                style={{ 
                  fontSize: `${40 * previewScale}px`,
                  marginBottom: `${20 * previewScale}px`,
                  lineHeight: '1.1'
                }}
              >
                ${activeProduct.price.replace('$', '')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVideoLayer;
