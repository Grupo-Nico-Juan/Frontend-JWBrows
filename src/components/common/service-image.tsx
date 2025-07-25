"use client"

import type React from "react"
import { useState } from "react"
import { ImageOff } from "lucide-react"

interface ImagenServicio {
  id: number
  url: string
}

interface ServiceImageProps {
  imagenes?: ImagenServicio[]
  serviceName: string
  className?: string
  fallbackSrc?: string
}

const ServiceImage: React.FC<ServiceImageProps> = ({
  imagenes,
  serviceName,
  className = "h-48 w-full object-cover",
  fallbackSrc = "/placeholder.svg?height=300&width=400&text=Sin+imagen",
}) => {
  const [imageError, setImageError] = useState(false)

  // Usar la primera imagen si existe, sino el fallback
  const primeraImagen = imagenes && imagenes.length > 0 ? imagenes[0] : null
  const imageSrc = primeraImagen && !imageError ? primeraImagen.url : fallbackSrc

  const handleImageError = () => {
    console.log("Error cargando imagen:", primeraImagen?.url)
    setImageError(true)
  }

  return (
    <div className="relative bg-[#f8f0ec] rounded-lg overflow-hidden">
      {primeraImagen && !imageError ? (
        <img
          src={primeraImagen.url || "/placeholder.svg"}
          alt={serviceName}
          className={className}
          onError={handleImageError}
          onLoad={() => console.log("Imagen cargada correctamente:", primeraImagen.url)}
        />
      ) : (
        <div className={`${className} flex items-center justify-center bg-[#f8f0ec] text-[#8d6e63]`}>
          <div className="text-center">
            <ImageOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm opacity-75">Sin imagen</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceImage
