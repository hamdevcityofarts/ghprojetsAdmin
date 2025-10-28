import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ImageSlider = ({ images = [], className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageError, setImageError] = useState({})

  // Image par défaut si aucune image
  const defaultImage = {
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop&auto=format',
    alt: 'Chambre d\'hôtel',
    isPrimary: true
  }

  const displayImages = images && images.length > 0 ? images : [defaultImage]

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const handleImageError = (index) => {
    console.error('❌ Erreur chargement image:', displayImages[index]?.url)
    setImageError(prev => ({ ...prev, [index]: true }))
  }

  const getCurrentImageUrl = () => {
    const currentImage = displayImages[currentIndex]
    if (imageError[currentIndex]) {
      return defaultImage.url
    }
    return currentImage?.url || defaultImage.url
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Image principale */}
      <div className="w-full h-full overflow-hidden bg-gray-200">
        <img
          src={getCurrentImageUrl()}
          alt={displayImages[currentIndex]?.alt || 'Image de chambre'}
          className="w-full h-full object-cover transition-transform duration-300"
          onError={() => handleImageError(currentIndex)}
        />
      </div>

      {/* Contrôles (visible seulement s'il y a plusieurs images) */}
      {displayImages.length > 1 && (
        <>
          {/* Bouton précédent */}
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Bouton suivant */}
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicateurs de pagination */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {displayImages.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>

          {/* Compteur d'images */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageSlider