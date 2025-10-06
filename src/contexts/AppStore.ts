import { create } from 'zustand';
import { AppState, VideoSettings, BackgroundImage, OverlayText, QRCode, ColorOverlay, Logo, Product, ProjectData } from '../types';

interface AppStore extends AppState {
  // Video Settings
  setVideoSettings: (settings: Partial<VideoSettings>) => void;
  
  // Background Image
  setBackgroundImage: (image: Partial<BackgroundImage>) => void;
  
  // Overlay Text
  setOverlayText: (text: Partial<OverlayText>) => void;
  
  // QR Code
  setQRCode: (qrCode: Partial<QRCode>) => void;
  
  // Color Overlay
  setColorOverlay: (overlay: Partial<ColorOverlay>) => void;
  
  // Logo
  setLogo: (logo: Partial<Logo>) => void;
  
  // Products
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  reorderProducts: (startIndex: number, endIndex: number) => void;
  
  // Preview
  setIsPreviewPlaying: (playing: boolean) => void;
  setPreviewTime: (time: number) => void;
  setIsPreviewMuted: (muted: boolean) => void;
  
  // Project Management
  saveProject: (name: string) => void;
  loadProject: (project: ProjectData) => void;
  clearProject: () => void;
  
  // Reset
  reset: () => void;
}

const initialState: AppState = {
  videoSettings: {
    duration: 30,
    resolution: '1080p',
    audioEnabled: true,
    position: { x: 70, y: 170 },
    size: { width: 1030, height: 579 },
  },
  backgroundImage: {
    opacity: 1,
    gradient: {
      enabled: false,
      color: '#000000',
      opacity: 0.5,
    },
  },
  overlayText: {
    content: 'Your Text Here',
    fontSize: 24,
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#ffffff',
    position: { x: 50, y: 50 },
    visible: true,
  },
  qrCode: {
    position: { x: 80, y: 80 },
    size: { width: 100, height: 100 },
    visible: true,
  },
  colorOverlay: {
    color: '#ffffff',
    opacity: 1.0, // Changed to 100% opacity
    visible: false,
    width: 750,
    height: 1080,
    position: 'right',
  },
  logo: {
    width: 100,
    height: 100,
    scale: 100, // Default 100%
    position: {
      x: 0,
      y: 0,
    },
    visible: false,
  },
  products: [],
  isPreviewPlaying: false,
  previewTime: 0,
  isPreviewMuted: true, // Muted by default
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,

  setVideoSettings: (settings) =>
    set((state) => ({
      videoSettings: { ...state.videoSettings, ...settings },
    })),

  setBackgroundImage: (image) =>
    set((state) => ({
      backgroundImage: { ...state.backgroundImage, ...image },
    })),

  setOverlayText: (text) =>
    set((state) => ({
      overlayText: { ...state.overlayText, ...text },
    })),

  setQRCode: (qrCode) =>
    set((state) => ({
      qrCode: { ...state.qrCode, ...qrCode },
    })),

  setColorOverlay: (overlay) =>
    set((state) => ({
      colorOverlay: { ...state.colorOverlay, ...overlay },
    })),

  setLogo: (logo) =>
    set((state) => ({
      logo: { ...state.logo, ...logo },
    })),

  addProduct: (product) => {
    console.log('🟢 STORE: addProduct called with:', product);
    set((state) => {
      const newProduct = { ...product, id: Date.now().toString() };
      const newProducts = [...state.products, newProduct];
      console.log('🟢 STORE: New products array:', newProducts);
      return { products: newProducts };
    });
  },

  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...product } : p
      ),
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  reorderProducts: (startIndex, endIndex) =>
    set((state) => {
      const newProducts = Array.from(state.products);
      const [removed] = newProducts.splice(startIndex, 1);
      newProducts.splice(endIndex, 0, removed);
      return { products: newProducts };
    }),

  setIsPreviewPlaying: (playing) => set({ isPreviewPlaying: playing }),
  setPreviewTime: (time) => set({ previewTime: time }),
  setIsPreviewMuted: (muted) => set({ isPreviewMuted: muted }),

  saveProject: (name) => {
    const state = get();
    const project: ProjectData = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
      videoSettings: state.videoSettings,
      backgroundImage: state.backgroundImage,
      overlayText: state.overlayText,
      qrCode: state.qrCode,
      colorOverlay: state.colorOverlay,
      logo: state.logo,
      products: state.products,
    };
    
    // Save to localStorage
    const savedProjects = JSON.parse(localStorage.getItem('video-creative-projects') || '[]');
    savedProjects.push(project);
    localStorage.setItem('video-creative-projects', JSON.stringify(savedProjects));
    
    set({ currentProject: project });
  },

  loadProject: (project) => {
    set({
      videoSettings: project.videoSettings,
      backgroundImage: {
        ...project.backgroundImage,
        gradient: project.backgroundImage?.gradient || {
          enabled: false,
          color: '#000000',
          opacity: 0.5,
        },
      },
      overlayText: project.overlayText,
      qrCode: project.qrCode,
      colorOverlay: project.colorOverlay || {
        color: '#ffffff',
        opacity: 0.5,
        visible: false,
        width: 750,
        height: 1080,
        position: 'right',
      },
      logo: project.logo || {
        width: 100,
        height: 100,
        scale: 100,
        position: {
          x: 0,
          y: 0,
        },
        visible: false,
      },
      products: project.products,
      currentProject: project,
    });
  },

  clearProject: () => set({ ...initialState }),

  reset: () => set(initialState),
}));

