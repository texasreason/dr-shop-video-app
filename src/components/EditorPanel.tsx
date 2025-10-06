import React from 'react';
import { motion } from 'framer-motion';
import VideoControls from './VideoControls';
import BackgroundImageUploader from './BackgroundImageUploader';
import TextOverlayEditor from './TextOverlayEditor';
import QRCodeUploader from './QRCodeUploader';
import ColorOverlayEditor from './ColorOverlayEditor';
import LogoUploader from './LogoUploader';
import CarouselEditor from './CarouselEditor';
import ProjectControls from './ProjectControls';
import { useEditorContext } from '../contexts/EditorContext';
import { useAppStore } from '../contexts/AppStore';
import { Trash2 } from 'lucide-react';
import VideoIcon from './icons/VideoIcon';

interface EditorPanelProps {
  showNavigationOnly?: boolean;
  showContentOnly?: boolean;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ showNavigationOnly = false, showContentOnly = false }) => {
  const { activeTab, setActiveTab } = useEditorContext();
  const { reset } = useAppStore();

  const tabs = [
    { id: 'background', label: 'Background', icon: '🖼️' },
    { id: 'video', label: 'Video', icon: 'video', isCustom: true },
    { id: 'logo', label: 'Logo', icon: '🏷️' },
    { id: 'text', label: 'Text', icon: '📝' },
    { id: 'overlay', label: 'Color Overlay', icon: '🎨' },
    { id: 'qr', label: 'QR Code', icon: '📱' },
    { id: 'products', label: 'Products', icon: '🛍️' },
    { id: 'project', label: 'Project', icon: '💾' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'video':
        return <VideoControls />;
      case 'background':
        return <BackgroundImageUploader />;
      case 'text':
        return <TextOverlayEditor />;
      case 'qr':
        return <QRCodeUploader />;
      case 'overlay':
        return <ColorOverlayEditor />;
      case 'logo':
        return <LogoUploader />;
      case 'products':
        return <CarouselEditor />;
      case 'project':
        return <ProjectControls />;
      default:
        return <VideoControls />;
    }
  };

  // If showing navigation only
  if (showNavigationOnly) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex justify-center px-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 bg-primary-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                } py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap`}
                title={tab.label}
              >
                {tab.isCustom ? (
                  <VideoIcon className="h-5 w-5 text-black" />
                ) : (
                  <span className="text-lg">{tab.icon}</span>
                )}
                <span>{tab.label}</span>
              </button>
            ))}
            
            {/* Reset Button */}
            <div className="flex items-center ml-4">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all content? This action cannot be undone.')) {
                    reset();
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center space-x-2"
                title="Reset All Content"
              >
                <Trash2 className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    );
  }

  // If showing content only
  if (showContentOnly) {
    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        {renderTabContent()}
      </motion.div>
    );
  }

  // Default: show both navigation and content (for backwards compatibility)
  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex justify-center px-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 bg-primary-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                } py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap`}
                title={tab.label}
              >
                {tab.isCustom ? (
                  <VideoIcon className="h-5 w-5 text-black" />
                ) : (
                  <span className="text-lg">{tab.icon}</span>
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="max-w-2xl mx-auto">
          {renderTabContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default EditorPanel;

