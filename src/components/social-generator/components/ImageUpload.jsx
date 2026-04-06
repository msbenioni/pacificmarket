/**
 * ImageUpload Component
 * 4-slot image uploader for the welcome cover slide (2×2 grid layout)
 * Each slot can be clicked to upload, or images can be dragged in
 */

import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

const SLOT_LABELS = ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'];

export default function ImageUpload({ 
  images = [], 
  maxImages = 4,
  onImagesChange,
  className = ''
}) {
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const bulkInputRef = useRef(null);

  // Process a single file into image data
  const processFile = (file) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: e.target.result,
          file: file,
          name: file.name,
          type: 'uploaded',
          alt: file.name
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload to a specific slot
  const handleSlotUpload = async (slotIndex, files) => {
    const file = files[0];
    if (!file) return;
    
    const imageData = await processFile(file);
    if (!imageData) return;
    
    const updated = [...images];
    // Pad array to reach the slot index
    while (updated.length <= slotIndex) {
      updated.push(null);
    }
    updated[slotIndex] = imageData;
    onImagesChange(updated.filter(Boolean).slice(0, maxImages));
  };

  // Bulk upload fills empty slots in order
  const handleBulkUpload = async (files) => {
    const fileArray = Array.from(files).slice(0, maxImages);
    const results = await Promise.all(fileArray.map(processFile));
    const validImages = results.filter(Boolean);
    
    const updated = [...images];
    let slotIndex = 0;
    
    for (const img of validImages) {
      // Find next empty slot
      while (slotIndex < maxImages && updated[slotIndex]) {
        slotIndex++;
      }
      if (slotIndex >= maxImages) break;
      updated[slotIndex] = img;
      slotIndex++;
    }
    
    onImagesChange(updated.filter(Boolean).slice(0, maxImages));
  };

  // Handle drop on a specific slot
  const handleSlotDrop = (e, slotIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlot(null);
    handleSlotUpload(slotIndex, e.dataTransfer.files);
  };

  // Handle drop on the bulk area
  const handleBulkDrop = (e) => {
    e.preventDefault();
    setDragOverSlot(null);
    handleBulkUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e, slotIndex) => {
    e.preventDefault();
    setDragOverSlot(slotIndex);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  // Remove image from a specific slot
  const removeImage = (slotIndex) => {
    const updated = [...images];
    updated.splice(slotIndex, 1);
    onImagesChange(updated);
  };

  // Clear all images
  const clearAll = () => {
    onImagesChange([]);
  };

  return (
    <div className={className}>
      {/* 2×2 Slot Grid — mirrors the cover layout */}
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((slotIndex) => {
          const image = images[slotIndex];
          const isDragTarget = dragOverSlot === slotIndex;
          
          return (
            <div
              key={slotIndex}
              className={`relative aspect-square rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                isDragTarget
                  ? 'border-primary bg-primary/10 scale-[1.02]'
                  : image
                    ? 'border-transparent'
                    : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50'
              }`}
              onClick={() => {
                if (!image) {
                  fileInputRefs[slotIndex].current?.click();
                }
              }}
              onDrop={(e) => handleSlotDrop(e, slotIndex)}
              onDragOver={(e) => handleDragOver(e, slotIndex)}
              onDragLeave={handleDragLeave}
            >
              {image ? (
                <>
                  <img
                    src={image.url}
                    alt={image.alt || `Slot ${slotIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Slot number badge */}
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {slotIndex + 1}
                  </div>
                  
                  {/* Remove button */}
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(slotIndex);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  
                  {/* Replace overlay on hover */}
                  <div
                    className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRefs[slotIndex].current?.click();
                    }}
                  >
                    <span className="text-white text-xs font-medium">Replace</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-1">
                  <Plus className="h-6 w-6" />
                  <span className="text-[10px] font-medium">{SLOT_LABELS[slotIndex]}</span>
                  <span className="text-[10px] opacity-60">Slot {slotIndex + 1}</span>
                </div>
              )}
              
              {/* Per-slot hidden file input */}
              <input
                ref={fileInputRefs[slotIndex]}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleSlotUpload(slotIndex, e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />
            </div>
          );
        })}
      </div>
      
      {/* Bulk upload area */}
      <div
        className="mt-3 border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30"
        onClick={() => bulkInputRef.current?.click()}
        onDrop={handleBulkDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOverSlot('bulk'); }}
        onDragLeave={handleDragLeave}
      >
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Upload className="h-4 w-4" />
          <span>Drop images here or click to fill empty slots</span>
        </div>
      </div>
      
      <input
        ref={bulkInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          handleBulkUpload(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />
      
      {/* Actions */}
      {images.length > 0 && (
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            {images.length}/4 images
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-destructive hover:text-destructive"
            onClick={clearAll}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
