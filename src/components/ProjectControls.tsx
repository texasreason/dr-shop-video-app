import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../contexts/AppStore';
import { Save, Upload, Download, Trash2, FolderOpen, X } from 'lucide-react';
import { ProjectData } from '../types';

const ProjectControls: React.FC = () => {
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    saveProject,
    loadProject,
    clearProject,
    currentProject,
  } = useAppStore();

  const [savedProjects, setSavedProjects] = useState<ProjectData[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('video-creative-projects') || '[]');
    } catch {
      return [];
    }
  });

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    saveProject(projectName.trim());
    setProjectName('');
    
    // Refresh saved projects list
    setSavedProjects(JSON.parse(localStorage.getItem('video-creative-projects') || '[]'));
    alert('Project saved successfully!');
  };

  const handleLoadProject = (project: ProjectData) => {
    loadProject(project);
    setShowLoadModal(false);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = savedProjects.filter(p => p.id !== projectId);
      setSavedProjects(updatedProjects);
      localStorage.setItem('video-creative-projects', JSON.stringify(updatedProjects));
    }
  };

  const handleExportProject = () => {
    const projectData = {
      ...currentProject,
      exportedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName || 'video-creative'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target?.result as string);
        loadProject(projectData);
        alert('Project imported successfully!');
      } catch (error) {
        alert('Error importing project. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearProject = () => {
    if (window.confirm('Are you sure you want to clear the current project? This action cannot be undone.')) {
      clearProject();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="section-title">Project Management</h3>

      {/* Current Project Info */}
      {currentProject && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-1">Current Project</h4>
          <p className="text-sm text-blue-800">{currentProject.name}</p>
          <p className="text-xs text-blue-600">
            Created: {new Date(currentProject.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Save Project */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Save Current Project
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="input-field flex-1"
          />
          <button
            onClick={handleSaveProject}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Load Project */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Load Saved Project
          </label>
          <button
            onClick={() => setShowLoadModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <FolderOpen className="h-4 w-4" />
            <span>Browse</span>
          </button>
        </div>
        
        {savedProjects.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {savedProjects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {project.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleLoadProject(project)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Load project"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Import/Export */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Import Project
          </label>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportProject}
            className="hidden"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Export Project
          </label>
          <button
            onClick={handleExportProject}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>


      {/* Load Project Modal */}
      {showLoadModal && (
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
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Load Project
                </h2>
                <button
                  onClick={() => setShowLoadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {savedProjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No saved projects found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(project.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          Duration: {project.videoSettings.duration}s | 
                          Resolution: {project.videoSettings.resolution} | 
                          Products: {project.products.length}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleLoadProject(project)}
                          className="btn-primary"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectControls;

