import React, { useState, useEffect } from 'react';
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

  // Find the active product for current time based on current order
  // Calculate timing dynamically based on product position in array
  const timePerProduct = products.length > 0 ? videoDuration / products.length : videoDuration;
  const currentProductIndex = Math.min(
    Math.floor(currentTime / timePerProduct),
    products.length - 1 // Clamp to last product
  );
  const activeProduct = products[currentProductIndex] || null;
  
  // Check if we're showing the last product
  const isLastProduct = currentProductIndex === products.length - 1;

  // Track animation states
  const [imageVisible, setImageVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [enableTransitions, setEnableTransitions] = useState(false);
  
  // Reset and animate when product changes
  useEffect(() => {
    if (!activeProduct) {
      return;
    }
    
    console.log('🔄 Product changed to:', activeProduct.id);
    
    // Step 1: Disable transitions and hide everything instantly
    setEnableTransitions(false);
    setImageVisible(false);
    setTextVisible(false);
    
    // Store timer IDs for cleanup
    let rafId1: number;
    let rafId2: number;
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    
    // Step 2: Wait for DOM to update with hidden state, then enable transitions
    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        console.log('✨ Enabling transitions and starting animations for:', activeProduct.id);
        setEnableTransitions(true);
        
        // Fade in image
        timer1 = setTimeout(() => {
          setImageVisible(true);
          console.log('🖼️ Image visible');
        }, 50);
        
        // Fade in text with slide up
        timer2 = setTimeout(() => {
          setTextVisible(true);
          console.log('📝 Text visible');
        }, 200);
      });
    });
    
    // Cleanup: Cancel all pending animations when product changes or unmounts
    return () => {
      console.log('🧹 Cleaning up animations for:', activeProduct.id);
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, [activeProduct?.id]);

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

  // Position product module using full resolution coordinates (1920x1080)
  // The parent container handles scaling, so we work in full resolution space
  const baseScale = 0.4; // Base preview scale to match video preview scaling
  const colorOverlayLeft = getOverlayPosition() * baseScale;
  const colorOverlayWidth = 600 * baseScale;
  const productModuleWidth = 450; // Increased from 300
  // Convert desired preview position (550px) to full resolution coordinates
  // Adjusting for observed scaling difference (1375 was showing as ~500, we want 550)
  const productModuleLeft = (550 / baseScale) * (550 / 500); // Compensate for actual vs expected scaling
  
  // Debug: Log the calculated positions
  console.log('🔍 Product Module Debug:', {
    colorOverlayPosition: getOverlayPosition(),
    baseScale,
    colorOverlayLeft,
    colorOverlayWidth,
    productModuleLeft,
    finalXPosition: `${productModuleLeft}px`
  });

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
        {/* Container for product/QR - always rendered */}
        <div
          className="absolute flex flex-col items-center justify-start"
          style={{
            right: colorOverlay.floatingStyle ? '-25px' : '-62.5px', // Move 30px right in preview = 75px in full res, so 50 - 75 = -25px
            width: '600px',
            top: colorOverlay.floatingStyle ? '50px' : '25px', // 10px margin from top (25px full res) + original 10px = 50px total
            height: '1080px',
            padding: '50px 40px',
            zIndex: 25,
          }}
        >
          {/* Product Showcase - Synchronized with video time */}
          {activeProduct && (
        <div
          key={activeProduct.id}
          className="w-full flex flex-col"
        >
          {/* Product Image - Centered at top */}
          {activeProduct.imageUrl && (
            <div 
              key={`image-${activeProduct.id}`}
              className="w-full flex justify-center"
              style={{
                marginBottom: '24px',
                opacity: imageVisible ? 1 : 0,
                transition: enableTransitions ? 'opacity 0.5s ease-in-out' : 'none',
              }}
            >
              <img
                src={activeProduct.imageUrl}
                alt={activeProduct.title}
                className="object-contain"
                style={{
                  maxWidth: '80%',
                  maxHeight: '320px',
                  height: 'auto',
                }}
              />
            </div>
          )}
          
          {/* Product Information - Below image */}
          <div 
            key={`text-${activeProduct.id}`}
            className="text-center w-full" 
            style={{ 
              padding: '0 20px',
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: enableTransitions ? 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out' : 'none',
            }}
          >
            <h3 
              style={{ 
                fontSize: '52px',
                fontWeight: '900',
                marginBottom: '8px',
                lineHeight: '1.1',
                color: '#000000',
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              {activeProduct.title}
            </h3>
            
            {activeProduct.secondaryCopy && (
              <p 
                style={{ 
                  fontSize: '32px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  lineHeight: '1.3',
                  color: '#000000',
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
                }}
              >
                {activeProduct.secondaryCopy}
              </p>
            )}
            
            {activeProduct.description && (
              <p 
                style={{ 
                  fontSize: '20px',
                  fontWeight: '400',
                  marginBottom: '20px',
                  lineHeight: '1.4',
                  color: '#666666',
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
                }}
              >
                {activeProduct.description}
              </p>
            )}
            
            <p 
              style={{ 
                fontSize: '56px',
                fontWeight: '900',
                marginTop: '20px',
                marginBottom: '40px',
                lineHeight: '1',
                color: '#000000',
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
              }}
            >
              ${activeProduct.price.replace('$', '')}
            </p>
          </div>
        </div>
          )}

          {/* QR Code - Always visible when uploaded, at bottom of container */}
          {qrCode.visible && qrCode.url && (
            <div className={activeProduct ? "mt-auto w-full flex flex-col items-center justify-center" : "w-full flex flex-col items-center justify-center"} 
                 style={{ 
                   padding: '0 30px',
                   marginTop: activeProduct ? 'auto' : '400px' // Center vertically if no products
                 }}>
              <img
                src={qrCode.url}
                alt="QR Code"
                style={{
                  width: '160px',
                  height: '160px',
                  objectFit: 'contain',
                  marginBottom: '12px',
                  display: 'block'
                }}
              />
              <p 
                style={{ 
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '6px',
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
                  fontSize: '13px',
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
      </div>
  );
};

export default ProductVideoLayer;
