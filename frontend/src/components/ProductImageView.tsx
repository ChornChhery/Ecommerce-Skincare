'use client';

import { useState, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ProductImageViewProps {
  images: string | string[];
  productName: string;
}

export default function ProductImageView({ images, productName }: ProductImageViewProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Convert images to array if it's a single string
  const imageArray = Array.isArray(images) ? images : [images];
  
  // Fallback image in case no images are provided
  const fallbackImage = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&h=300';
  const validImages = imageArray.filter(img => img && img.trim() !== '');
  const displayImage = validImages.length > 0 ? validImages[0] : fallbackImage;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div 
      ref={imageRef}
      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onClick={handleZoomToggle}
    >
      <img
        src={displayImage}
        alt={productName}
        className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
        style={isZoomed ? {
          transform: 'scale(1.5)',
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
        } : {}}
      />

      {/* Zoom overlay */}
      <div className={`
        absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 
        transition-all duration-300 flex items-center justify-center
      `}>
        <div className={`
          bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100
          transition-opacity duration-300 transform scale-90 group-hover:scale-100
        `}>
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-700" />
        </div>
      </div>
    </div>
  );
}
