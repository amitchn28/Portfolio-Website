import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RefreshCw, 
  Move, 
  Check, 
  Camera, 
  Loader2 
} from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (file: File) => Promise<void> | void;
  isUploading?: boolean;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  isUploading = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset transforms whenever a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc]);

  // Handle Drag / Pan start
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(Math.max(1, prev + delta), 3.5));
  };

  // Reset all adjustments
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Export cropped & adjusted image using HTML5 Canvas
  const handleApply = async () => {
    const img = imageRef.current;
    if (!img) return;

    const exportSize = 512; // High-res 512x512 square avatar
    const viewportSize = 280; // Size of the circular crop area in the modal
    const exportScale = exportSize / viewportSize;

    const canvas = document.createElement('canvas');
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background with transparent
    ctx.clearRect(0, 0, exportSize, exportSize);

    ctx.save();
    // Move origin to center of export canvas
    ctx.translate(exportSize / 2, exportSize / 2);
    // Apply user rotation
    ctx.rotate((rotation * Math.PI) / 180);
    // Apply user zoom
    ctx.scale(zoom, zoom);
    // Apply user pan coordinates scaled up to the export canvas
    ctx.translate(pan.x * exportScale, pan.y * exportScale);

    // Compute base display dimensions (cover viewport)
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let baseW = exportSize;
    let baseH = exportSize;
    if (imgAspect > 1) {
      baseW = exportSize * imgAspect;
      baseH = exportSize;
    } else {
      baseW = exportSize;
      baseH = exportSize / imgAspect;
    }

    ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH);
    ctx.restore();

    // Convert canvas to WebP or PNG Blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'adjusted-avatar.webp', { type: 'image/webp' });
        await onCropComplete(file);
      },
      'image/webp',
      0.95
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-space-900 border border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Adjust &amp; Position Photo
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Drag to frame face • Zoom &amp; rotate to fit circular avatar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cropper Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Main Interactive Viewport */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              ref={containerRef}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`relative w-[280px] h-[280px] rounded-2xl overflow-hidden bg-space-950 border border-slate-800 touch-none select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* Image Element */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Adjust preview"
                onLoad={() => setImageLoaded(true)}
                draggable={false}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none will-change-transform origin-center pointer-events-none"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom}) rotate(${rotation}deg)`,
                  opacity: imageLoaded ? 1 : 0,
                  transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                }}
              />

              {/* Dimmed Overlay with Circular Cutout Mask */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: '0 0 0 9999px rgba(3, 7, 18, 0.72)',
                  borderRadius: '9999px',
                  width: '240px',
                  height: '240px',
                  top: '20px',
                  left: '20px',
                  border: '2px solid rgba(226, 177, 122, 0.9)',
                }}
              >
                {/* Tactical Corner Guides */}
                <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1px] bg-amber-400/50 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-[1px] bg-amber-400/50 pointer-events-none" />
              </div>

              {/* Hint badge */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-space-950/80 border border-slate-700/60 text-[10px] text-slate-400 font-mono flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                <Move className="w-2.5 h-2.5 text-amber-400" />
                <span>Drag to reposition</span>
              </div>
            </div>

            {/* Live Portfolio Preview (Glowing Halo Replica) */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-space-950 border border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400">Live Portfolio Preview:</span>
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-sky-400 to-amber-300 rounded-full blur-xs opacity-80"></div>
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-amber-400/80 bg-space-900 flex items-center justify-center">
                  <img
                    src={imageSrc}
                    alt="Mini preview"
                    draggable={false}
                    className="w-full h-full object-cover max-w-none origin-center"
                    style={{
                      transform: `translate(${pan.x * (56 / 280)}px, ${pan.y * (56 / 280)}px) scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Zoom, Rotate, Reset */}
          <div className="space-y-4 pt-2 border-t border-slate-800/80">
            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zoom Level</span>
                </span>
                <span className="font-mono text-amber-400 text-[11px]">
                  {zoom.toFixed(2)}x
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(1, prev - 0.1))}
                  className="p-1 rounded-lg bg-space-950 border border-slate-800 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="3.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-space-950 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(3.5, prev + 0.1))}
                  className="p-1 rounded-lg bg-space-950 border border-slate-800 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Actions Bar (Rotate & Reset) */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-3 py-1.5 rounded-xl bg-space-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Rotate 90° ({rotation}°)</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-space-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Adjustment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-space-950/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-space-900 hover:bg-slate-800 border border-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isUploading}
            className="px-5 py-2 rounded-xl text-xs font-bold font-cyber uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Uploading Adjusted Photo...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Save &amp; Apply Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
