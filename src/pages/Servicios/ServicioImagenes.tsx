"use client"

import type React from "react"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ImageIcon, Trash2, Loader2, Upload } from "lucide-react"

// Componentes reutilizables
import PageLayout from "@/components/common/page-layout"
import PageHeader from "@/components/common/page-header"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface Imagen {
  id: number
  url: string
}

const ServicioImagenes: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const [imagenes, setImagenes] = useState<Imagen[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviews(urls)
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [selectedFiles])

  useEffect(() => {
    const fetchImagenes = async () => {
      if (!id) return
      try {
        const res = await axios.get(`/api/Servicio/${id}`)
        setImagenes(res.data.imagenes ?? [])
      } catch {
        setError("No se pudieron cargar las imágenes")
      } finally {
        setLoading(false)
      }
    }
    fetchImagenes()
  }, [id])

  const recargar = async () => {
    if (!id) return
    try {
      const res = await axios.get(`/api/Servicio/${id}`)
      setImagenes(res.data.imagenes ?? [])
    } catch {
      setError("No se pudieron cargar las imágenes")
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setSelectedFiles(Array.from(files))
  }

  const confirmUpload = async () => {
    if (!id || selectedFiles.length === 0) return
    const data = new FormData()
    selectedFiles.forEach((file) => data.append("archivos", file))
    setUploading(true)
    try {
      await axios.post(`/api/Servicio/${id}/imagenes`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Imágenes subidas correctamente")
      setSelectedFiles([])
      if (inputRef.current) inputRef.current.value = ""
      await recargar()
    } catch {
      toast.error("Error al subir imágenes")
    } finally {
      setUploading(false)
    }
  }

  const cancelUpload = () => {
    setSelectedFiles([])
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleDelete = async (imagenId: number) => {
    if (!window.confirm("¿Eliminar imagen?")) return
    try {
      await axios.delete(`/api/Servicio/imagenes/${imagenId}`)
      setImagenes((imgs) => imgs.filter((img) => img.id !== imagenId))
      toast.success("Imagen eliminada")
    } catch {
      toast.error("No se pudo eliminar la imagen")
    }
  }

  const handleBack = () => navigate("/servicios")

  if (loading) {
    return <LoadingSpinner message="Cargando imágenes..." />
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          title="Gestión de Imágenes"
          subtitle="Administra las imágenes del servicio"
          icon={ImageIcon}
          actionButton={{
            label: "Volver",
            onClick: handleBack,
          }}
        />

        {error && <ErrorAlert message={error} />}

        {/* Sección de subida de imágenes */}
        <MotionWrapper animation="slideUp">
          <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
            <CardHeader>
              <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Subir imágenes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="border-[#e0d6cf] focus:border-[#a1887f]"
              />
              {previews.length > 0 && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {previews.map((url, idx) => (
                      <MotionWrapper key={idx} animation="fadeIn">
                        <img
                          src={url || "/placeholder.svg"}
                          alt="Previsualización"
                          className="w-full h-32 object-cover rounded-lg border border-[#e0d6cf]"
                        />
                      </MotionWrapper>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={cancelUpload}
                      className="border-[#e0d6cf] text-[#8d6e63] hover:bg-[#f3e5e1] hover:text-[#6d4c41] bg-transparent"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={confirmUpload}
                      disabled={uploading}
                      className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Subir
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Grid de imágenes existentes */}
        <MotionWrapper animation="slideUp">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {imagenes.map((img, index) => (
              <MotionWrapper key={img.id} animation="fadeIn">
                <Card className="relative bg-white/80 backdrop-blur-sm border-[#e0d6cf] overflow-hidden">
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt="Imagen del servicio"
                    className="w-full h-40 object-cover"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDelete(img.id)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white border-red-200 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </MotionWrapper>

        {imagenes.length === 0 && !error && (
          <MotionWrapper animation="fadeIn" >
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#7a5b4c]/20 to-[#a37e63]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-[#7a5b4c]/60" />
              </div>
              <h3 className="text-lg font-semibold text-[#7a5b4c] mb-2">No hay imágenes</h3>
              <p className="text-[#7a5b4c]/70 mb-4">Sube las primeras imágenes para este servicio</p>
            </Card>
          </MotionWrapper>
        )}
      </div>
    </PageLayout>
  )
}

export default ServicioImagenes
