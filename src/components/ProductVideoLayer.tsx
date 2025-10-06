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
  const previewScale = 0.55; // Increased from 0.4 to make it larger and more visible

  // Find the active product for current time
  const activeProduct = products.find(product => 
    currentTime >= product.timing.startTime && 
    currentTime < product.timing.startTime + product.timing.duration
  );

  // Full resolution positioning (will be scaled down)
  const fullResColorOverlayLeft = 1920 - 600; // Right-aligned 600px overlay
  const fullResProductCarouselWidth = 450;
  // Simplified centering: center the product in the color overlay
  const fullResProductCarouselLeft = fullResColorOverlayLeft + (600 - fullResProductCarouselWidth) / 2;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
      {/* Product Showcase - Synchronized with video time */}
      {activeProduct && (
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: `${fullResProductCarouselLeft * previewScale}px`,
            width: `${fullResProductCarouselWidth * previewScale}px`,
            top: `${50 * previewScale}px`,
            padding: `${40 * previewScale}px ${16 * previewScale}px`,
            zIndex: 25,
          }}
        >
          {/* Product content without background */}
          <div 
            className="p-6 text-center"
            style={{
              width: '100%',
              minHeight: `${800 * previewScale}px`
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

              {/* QR Code Section within product showcase */}
              {qrCode.visible && qrCode.url && (
                <div className="text-center mt-4">
                  <img
                    src={qrCode.url}
                    alt="QR Code"
                    className="mx-auto mb-2"
                    style={{
                      width: `${120 * previewScale}px`,
                      height: `${120 * previewScale}px`
                    }}
                  />
                  <p 
                    className="font-bold text-gray-900"
                    style={{ 
                      fontSize: `${14 * previewScale}px`,
                      marginBottom: `${4 * previewScale}px`
                    }}
                  >
                    SHOP NOW
                  </p>
                  <p 
                    className="text-gray-600"
                    style={{ 
                      fontSize: `${12 * previewScale}px`
                    }}
                  >
                    Scan QR code to shop all the products
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVideoLayer;
