import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '../contexts/AppStore';
import { Plus, GripVertical, Edit, Trash2, Clock, Upload } from 'lucide-react';
import ProductForm from './ProductForm';

const CarouselEditor: React.FC = () => {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const {
    products,
    addProduct,
    removeProduct,
    reorderProducts,
    videoSettings,
  } = useAppStore();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    reorderProducts(result.source.index, result.destination.index);
  };

  const handleAddProduct = () => {
    const newProduct = {
      title: 'street 3',
      secondaryCopy: 'Secondary text',
      description: 'Product description',
      price: '0.00', // Remove $ from default - will be added automatically in display
      timing: {
        startTime: products.length * 5, // 5 seconds per product
        duration: 5,
      },
    };
    console.log('Adding product:', newProduct);
    addProduct(newProduct);
    console.log('Products after add:', products.length + 1);
  };

  // Handle image file drops
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const newProduct = {
        title: file.name.replace(/\.[^/.]+$/, ''),
        secondaryCopy: 'Secondary text',
        description: 'Product description',
        price: '0.00',
        image: file,
        imageUrl: URL.createObjectURL(file),
        timing: {
          startTime: products.length * 5,
          duration: 5,
        },
      };
      addProduct(newProduct);
    });
  }, [products.length, addProduct]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    noClick: false,
  });

  const calculateProductTiming = (index: number) => {
    const totalDuration = videoSettings.duration;
    const productCount = products.length || 1;
    const timePerProduct = totalDuration / productCount;
    
    return {
      startTime: index * timePerProduct,
      duration: timePerProduct,
    };
  };

  const updateProductTiming = (index: number) => {
    const timing = calculateProductTiming(index);
    const product = products[index];
    if (product) {
      // This would need to be implemented in the store
      // For now, we'll just show the calculated timing
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Product Carousel</h3>
        <button
          onClick={() => {
            console.log('🔴 ADD PRODUCT BUTTON CLICKED!');
            handleAddProduct();
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-3">
          <Upload className="h-12 w-12 text-gray-400" />
          <div>
            <p className="text-base font-medium text-gray-700">
              Drag & drop product images here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to select multiple images (JPG, PNG, GIF, WebP)
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Each image will create a new product tile that you can edit
          </p>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No products added yet.</p>
            <p className="text-sm">Click "Add Product" to get started.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="products">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {products.map((product, index) => (
                    <Draggable
                      key={product.id}
                      draggableId={product.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white border rounded-lg p-4 transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : 'shadow-sm'
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                            userSelect: 'none',
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              {...provided.dragHandleProps}
                              className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing flex-shrink-0"
                              style={{ touchAction: 'none' }}
                              title="Drag to reorder"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            
                            {/* Product Thumbnail */}
                            {product.imageUrl && (
                              <div className="flex-shrink-0">
                                <img
                                  src={product.imageUrl}
                                  alt={product.title}
                                  className="w-16 h-16 object-cover rounded border border-gray-200"
                                  draggable="false"
                                />
                              </div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">
                                  {index + 1}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {product.secondaryCopy}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {calculateProductTiming(index).startTime.toFixed(1)}s - 
                                    {(calculateProductTiming(index).startTime + calculateProductTiming(index).duration).toFixed(1)}s
                                  </span>
                                </span>
                                <span>{product.price}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <button
                                onClick={() => setEditingProduct(product.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                type="button"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Timing Summary */}
      {products.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Timing Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Total Duration: {videoSettings.duration} seconds</p>
            <p>Products: {products.length}</p>
            <p>Time per product: {(videoSettings.duration / products.length).toFixed(1)} seconds</p>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {editingProduct && (
        <ProductForm
          productId={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default CarouselEditor;

