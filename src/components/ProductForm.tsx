import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../contexts/AppStore';
import { X, Upload, Clock } from 'lucide-react';

interface ProductFormProps {
  productId: string;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    products,
    updateProduct,
    videoSettings,
  } = useAppStore();

  const product = products.find(p => p.id === productId);

  useEffect(() => {
    if (!product) {
      onClose();
    }
  }, [product, onClose]);

  if (!product) return null;

  const handleFieldChange = (field: keyof typeof product, value: any) => {
    updateProduct(productId, { [field]: value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateProduct(productId, {
        image: file,
        imageUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleTimingChange = (field: 'startTime' | 'duration', value: number) => {
    updateProduct(productId, {
      timing: {
        ...product.timing,
        [field]: value,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Product
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Product Image */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 cursor-pointer transition-colors"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt="Product preview"
                    className="mx-auto h-48 w-48 object-contain rounded-lg"
                  />
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <p className="mt-2 text-sm text-gray-600">
                  {product.image ? product.image.name : 'Click to upload image'}
                </p>
                <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Product Information - positioned under image */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Product Title
                </label>
                <input
                  type="text"
                  value={product.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="input-field"
                  placeholder="Enter product title"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.price.replace('$', '')} // Remove $ for editing
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    className="input-field pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Secondary Copy
                </label>
                <input
                  type="text"
                  value={product.secondaryCopy}
                  onChange={(e) => handleFieldChange('secondaryCopy', e.target.value)}
                  className="input-field"
                  placeholder="Enter secondary text"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="input-field resize-none h-20"
                  placeholder="Enter brand name"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductForm;

