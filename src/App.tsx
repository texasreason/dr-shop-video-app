import React from 'react';
import { motion } from 'framer-motion';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import { EditorProvider } from './contexts/EditorContext';
import './App.css';

function App() {
  return (
    <EditorProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Video Creative Studio
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Create stunning video creatives with ease
            </div>
          </div>
        </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Full-width Navigation */}
            <div className="w-full">
              <EditorPanel showNavigationOnly={true} />
            </div>

            {/* Content Layout: Video Settings (left) + Preview (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Settings Panel - narrow left sidebar */}
              <div className="lg:col-span-1">
                <EditorPanel showContentOnly={true} />
              </div>

              {/* Preview Panel - wider right area */}
              <div className="lg:col-span-2">
                <PreviewPanel />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </EditorProvider>
  );
}

export default App;

