import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { useAppStore } from '../contexts/AppStore';
import { Plus, GripVertical, Edit, Trash2, Clock } from 'lucide-react';
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
      title: 'New Product',
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
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`bg-white border rounded-lg p-4 ${
                            snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              {...provided.dragHandleProps}
                              className="text-gray-400 hover:text-gray-600 cursor-grab"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {product.title}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  #{index + 1}
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

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingProduct(product.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
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

