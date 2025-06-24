import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface Habilidad {
  id: number
  nombre: string
  descripcion: string
}

const AsignarHabilidadesServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [habilidades, setHabilidades] = useState<Habilidad[]>([])
  const [habilidadesAsignadas, setHabilidadesAsignadas] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTodas, resAsignadas] = await Promise.all([
          axios.get<Habilidad[]>("/api/Habilidad"),
          axios.get<Habilidad[]>(`/api/Servicio/${id}/habilidades`)
        ])
        setHabilidades(resTodas.data)
        setHabilidadesAsignadas(resAsignadas.data.map(h => h.id))
      } catch (err) {
        toast.error("Error al cargar habilidades")
      }
    }
    fetchData()
  }, [id])

  const toggleHabilidad = async (habilidadId: number, asignada: boolean) => {
    setLoading(true)
    try {
      if (asignada) {
        await axios.delete(`/api/Servicio/${id}/habilidades/${habilidadId}`)
        toast.success("Habilidad quitada")
        setHabilidadesAsignadas(prev => prev.filter(h => h !== habilidadId))
      } else {
        await axios.post(`/api/Servicio/${id}/habilidades/${habilidadId}`)
        toast.success("Habilidad asignada")
        setHabilidadesAsignadas(prev => [...prev, habilidadId])
      }
    } catch {
      toast.error("Error al actualizar habilidad")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1] px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-2xl">
        <Card className="bg-[#fffaf5] border border-[#e6dcd4] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#6e4b3a]">Habilidades del Servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {habilidades.map((h) => {
              const asignada = habilidadesAsignadas.includes(h.id)
              return (
                <div key={h.id} className="flex items-center gap-4">
                  <Checkbox
                    checked={asignada}
                    onCheckedChange={() => toggleHabilidad(h.id, asignada)}
                    disabled={loading}
                    id={`hab-${h.id}`}
                  />
                  <Label htmlFor={`hab-${h.id}`} className="text-[#4e342e]">
                    {h.nombre} — <span className="text-sm text-muted-foreground">{h.descripcion}</span>
                  </Label>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AsignarHabilidadesServicio
