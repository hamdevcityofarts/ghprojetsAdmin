// src/components/RoomImage.jsx
import React, { useState } from 'react'
import { ImageOff } from 'lucide-react'

const RoomImage = ({ 
  src, 
  alt = 'Chambre d\'hôtel', 
  className = '', 
  fallbackSrc = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop&auto=format'
}) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      console.warn(`Image failed to load: ${imgSrc}, using fallback`)
      setImgSrc(fallbackSrc)
      setIsError(false) // Reset error pour essayer le fallback
    } else {
      setIsError(true)
      setIsLoading(false)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
    setIsError(false)
  }

  if (isError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <div className="text-center text-gray-400">
          <ImageOff className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">Image non disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  )
}

export default RoomImage