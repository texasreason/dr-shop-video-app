import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditorContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('background');

  return (
    <EditorContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </EditorContext.Provider>
  );
};
