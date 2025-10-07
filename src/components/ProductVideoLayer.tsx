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

  // Position product module over the color overlay area
  const colorOverlayLeft = getOverlayPosition() * previewScale;
  const colorOverlayWidth = 600 * previewScale;
  const productModuleWidth = 400 * previewScale;
  const productModuleLeft = colorOverlayLeft + (colorOverlayWidth - productModuleWidth) / 2 + 200; // Shifted 200px to the right

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
      {/* Product Showcase - Synchronized with video time */}
      {activeProduct && (
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: `${productModuleLeft}px`,
            width: `${productModuleWidth}px`,
            top: `${60 * previewScale}px`,
            padding: `${20 * previewScale}px ${10 * previewScale}px`,
            zIndex: 25,
          }}
        >
          {/* Product content without background */}
          <div 
            className="p-6 text-center"
            style={{
              width: '100%',
              minHeight: `${500 * previewScale}px`
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
