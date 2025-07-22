"use client"
import type React from "react"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  ArrowLeft,
  Image as ImageIcon,
  Trash2,
  Loader2,
  Upload,
} from "lucide-react"

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg border border-[#e0d6cf] p-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/servicios")}
              className="text-[#8d6e63] hover:text-[#6d4c41] hover:bg-[#f3e5e1]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a1887f] rounded-lg">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6d4c41]">Gestión de Imágenes</h1>
              </div>
            </div>
          </div>
        </motion.div>

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
            />
            {previews.length > 0 && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {previews.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Previsualización"
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={cancelUpload}
                    className="border-[#e0d6cf] text-[#8d6e63] hover:bg-[#f3e5e1] hover:text-[#6d4c41]"
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

        {error && <p className="text-red-600 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imagenes.map((img) => (
            <Card key={img.id} className="relative bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <img src={img.url} alt="Imagen del servicio" className="w-full h-40 object-cover rounded-t" />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 bg-white/80"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ServicioImagenes
