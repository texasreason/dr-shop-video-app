# Video Creative Studio

A powerful web-based application for creating professional video creatives with customizable overlays, product carousels, and export functionality.

## Features

### 🎥 Video Management
- Upload background videos with audio support
- Choose between 30-second and 60-second durations
- Export in 1080p (1920×1080) or 4K (3840×2160) resolution
- Real-time video preview with playback controls

### 🖼️ Visual Elements
- **Background Images**: Upload and overlay background images with opacity control
- **Text Overlays**: Customizable text with font, size, color, and positioning
- **QR Codes**: Upload and position QR codes with size adjustment

### 🛍️ Product Carousel
- Create multiple product showcases
- Drag-and-drop reordering
- Individual timing control for each product
- Product details: title, description, price, and images
- Automatic timing distribution across video duration

### 📱 Live Preview
- Real-time preview of all elements combined
- Playback controls (play, pause, scrub)
- Timeline view of product sequence
- Exact representation of final export

### 💾 Project Management
- Save projects locally with JSON export/import
- Load and continue editing saved projects
- Project metadata and versioning

### 🎬 Export & Download
- Generate MP4 videos with all elements
- High-quality rendering with audio
- Download ready-to-use video files

## Tech Stack

- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Beautiful DnD** for drag-and-drop
- **FFmpeg.wasm** for video processing (client-side)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Modern web browser with WebAssembly support

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Usage

### Creating a Video Creative

1. **Upload Video**: Start by uploading a background video in the Video tab
2. **Set Duration**: Choose between 30 or 60 seconds
3. **Add Background**: Upload and adjust background image opacity
4. **Add Text**: Create text overlays with custom styling and positioning
5. **Add QR Code**: Upload and position QR codes
6. **Create Products**: Add products to the carousel with timing controls
7. **Preview**: Use the live preview to see your creative in action
8. **Export**: Generate and download your final MP4 video

### Project Management

- **Save Project**: Enter a name and save your current work
- **Load Project**: Browse and load previously saved projects
- **Export/Import**: Share projects via JSON files
- **Clear Project**: Start fresh with a new project

## File Structure

```
src/
├── components/          # React components
│   ├── EditorPanel.tsx  # Main editing interface
│   ├── VideoControls.tsx
│   ├── BackgroundImageUploader.tsx
│   ├── TextOverlayEditor.tsx
│   ├── QRCodeUploader.tsx
│   ├── CarouselEditor.tsx
│   ├── ProductForm.tsx
│   ├── PreviewPanel.tsx
│   ├── ExportControls.tsx
│   └── ProjectControls.tsx
├── contexts/           # State management
│   └── AppStore.ts     # Zustand store
├── types/              # TypeScript definitions
│   └── index.ts
├── App.tsx             # Main app component
├── App.css             # Global styles
├── index.tsx           # App entry point
└── index.css           # TailwindCSS imports
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance Notes

- Large video files may take time to process
- 4K exports require more processing power
- Consider video file sizes for optimal performance
- WebAssembly support required for video processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.

