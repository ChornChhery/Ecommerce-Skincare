'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export default function ProductImageGallery({ images, productName, className = '' }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<Set<number>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback image
  const fallbackImage = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&h=300';
  
  // Filter out failed images and ensure we have at least one image
  const validImages = images.filter((_, index) => !imageLoadError.has(index));
  const displayImages = validImages.length > 0 ? validImages : [fallbackImage];

  const currentImage = displayImages[currentImageIndex] || fallbackImage;

  const handleImageError = (index: number) => {
    setImageLoadError(prev => new Set([...prev, index]));
  };

  const handlePrevious = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex(prev => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isZoomed) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    setIsZoomed(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            handlePrevious();
            break;
          case 'ArrowRight':
            handleNext();
            break;
          case 'Escape':
            setIsFullscreen(false);
            setIsZoomed(false);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  return (
    <>
      {/* Main Gallery */}
      <div className={`space-y-4 ${className}`}>
        {/* Main Image */}
        <div className="relative group">
          <div 
            ref={containerRef}
            className={`
              relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer
              ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
            `}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
            onClick={handleZoomToggle}
          >
            <img
              ref={imageRef}
              src={currentImage}
              alt={`${productName} - Image ${currentImageIndex + 1}`}
              className={`
                w-full h-full object-cover transition-transform duration-300 ease-in-out
                ${isZoomed ? 'scale-150' : 'scale-100'}
              `}
              style={isZoomed ? {
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              } : {}}
              onError={() => handleImageError(currentImageIndex)}
            />

            {/* Zoom Overlay */}
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

            {/* Navigation Arrows (Desktop) */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                  className={`
                    absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100
                    rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300
                    transform -translate-x-2 group-hover:translate-x-0 hidden md:block
                  `}
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className={`
                    absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100
                    rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300
                    transform translate-x-2 group-hover:translate-x-0 hidden md:block
                  `}
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                </button>
              </>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleFullscreenToggle(); }}
              className={`
                absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100
                rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300
              `}
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>

            {/* Image Counter */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {displayImages.length}
              </div>
            )}
          </div>

          {/* Mobile Navigation Dots */}
          {displayImages.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2 md:hidden">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${index === currentImageIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'}
                  `}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Grid (Desktop) */}
        {displayImages.length > 1 && (
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`
                  relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300
                  ${index === currentImageIndex 
                    ? 'border-blue-600 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
                {index === currentImageIndex && (
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-20" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Swipe Navigation */}
        {displayImages.length > 1 && (
          <div className="flex justify-between px-4 md:hidden">
            <button
              onClick={handlePrevious}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors duration-300"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors duration-300"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4">
            <img
              src={currentImage}
              alt={`${productName} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Fullscreen Controls */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-white"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-white"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white text-sm px-3 py-2 rounded">
                  {currentImageIndex + 1} of {displayImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}