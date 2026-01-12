export interface VideoSettings {
  duration: number; // Changed from 30 | 60 to number to support actual video duration
  resolution: '1080p' | '4K';
  baseVideo?: File;
  audioEnabled: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export interface BackgroundImage {
  file?: File;
  url?: string;
  opacity: number;
  gradient: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
}

export interface OverlayText {
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
  visible: boolean;
}

export interface QRCode {
  file?: File;
  url?: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  visible: boolean;
}

export interface ColorOverlay {
  color: string;
  opacity: number;
  visible: boolean;
  floatingStyle?: boolean;
  width?: number;
  height?: number;
  position?: 'left' | 'right' | 'center';
}

export interface Logo {
  file?: File;
  url?: string;
  width: number;
  height: number;
  scale: number; // Scale percentage (100 = 100%)
  position: {
    x: number;
    y: number;
  };
  visible: boolean;
}

export interface Product {
  id: string;
  title: string;
  secondaryCopy: string;
  description: string;
  price: string;
  image?: File;
  imageUrl?: string;
  timing: {
    startTime: number;
    duration: number;
  };
}

export interface ProjectData {
  id: string;
  name: string;
  createdAt: Date;
  videoSettings: VideoSettings;
  backgroundImage: BackgroundImage;
  overlayText: OverlayText;
  qrCode: QRCode;
  colorOverlay: ColorOverlay;
  logo: Logo;
  products: Product[];
}

export interface AppState {
  videoSettings: VideoSettings;
  backgroundImage: BackgroundImage;
  overlayText: OverlayText;
  qrCode: QRCode;
  colorOverlay: ColorOverlay;
  logo: Logo;
  products: Product[];
  currentProject?: ProjectData;
  isPreviewPlaying: boolean;
  previewTime: number;
  isPreviewMuted: boolean;
}

