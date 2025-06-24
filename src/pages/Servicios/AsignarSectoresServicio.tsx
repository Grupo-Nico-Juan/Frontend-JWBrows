import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface Sector {
  id: number
  nombre: string
  descripcion: string
  sucursalId: number
}

const AsignarSectoresServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [sectores, setSectores] = useState<Sector[]>([])
  const [sectoresAsignados, setSectoresAsignados] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTodos, resAsignados] = await Promise.all([
          axios.get<Sector[]>("/api/Sector"),
          axios.get<Sector[]>(`/api/Servicio/${id}/sectores`)
        ])
        setSectores(resTodos.data)
        setSectoresAsignados(resAsignados.data.map(s => s.id))
      } catch (err) {
        toast.error("Error al cargar sectores")
      }
    }
    fetchData()
  }, [id])

  const toggleSector = async (sectorId: number, asignado: boolean) => {
    setLoading(true)
    try {
      if (asignado) {
        await axios.delete(`/api/Servicio/${id}/sectores/${sectorId}`)
        toast.success("Sector quitado")
        setSectoresAsignados(prev => prev.filter(s => s !== sectorId))
      } else {
        await axios.post(`/api/Servicio/${id}/sectores/${sectorId}`)
        toast.success("Sector asignado")
        setSectoresAsignados(prev => [...prev, sectorId])
      }
    } catch {
      toast.error("Error al actualizar sector")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1] px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-2xl">
        <Card className="bg-[#fffaf5] border border-[#e6dcd4] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#6e4b3a]">Sectores del Servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sectores.map((s) => {
              const asignado = sectoresAsignados.includes(s.id)
              return (
                <div key={s.id} className="flex items-center gap-4">
                  <Checkbox
                    checked={asignado}
                    onCheckedChange={() => toggleSector(s.id, asignado)}
                    disabled={loading}
                    id={`sec-${s.id}`}
                  />
                  <Label htmlFor={`sec-${s.id}`} className="text-[#4e342e]">
                    {s.nombre} — <span className="text-sm text-muted-foreground">{s.descripcion}</span>
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

export default AsignarSectoresServicio
