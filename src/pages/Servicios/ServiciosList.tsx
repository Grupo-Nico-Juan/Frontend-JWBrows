import React, { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Servicio {
  id: number
  nombre: string
  descripcion: string
  duracionMinutos: number
  precio: number
}

const ServiciosList: React.FC = () => {
  const navigate = useNavigate()
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await axios.get<Servicio[]>("/api/Servicio")
        setServicios(res.data)
      } catch {
        setError("Error al cargar los servicios")
      }
    }
    fetchServicios()
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este servicio?")) return
    try {
      await axios.delete(`/api/Servicio/${id}`)
      setServicios(servicios.filter((s) => s.id !== id))
    } catch {
      setError("No se pudo eliminar el servicio")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-5xl bg-[#fdf6f1] border border-[#e0d6cf]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6d4c41]">Servicios</CardTitle>
            <div className="mt-2">
              <motion.div
                className="inline-block origin-left"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                  onClick={() => navigate("/servicios/nuevo")}
                >
                  Nuevo Servicio
                </Button>
              </motion.div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f3e5e1]">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicios.map((servicio) => (
                    <TableRow key={servicio.id}>
                      <TableCell>{servicio.nombre}</TableCell>
                      <TableCell>{servicio.descripcion}</TableCell>
                      <TableCell>{servicio.duracionMinutos} min</TableCell>
                      <TableCell>${servicio.precio}</TableCell>
                      <TableCell className="flex gap-2 flex-wrap">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-[#6d4c41] text-white hover:bg-[#5d4037]"
                            onClick={() => navigate(`/servicios/editar/${servicio.id}`)}
                          >
                            Editar
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(servicio.id)}
                          >
                            Eliminar
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-[#8d6e63] text-white hover:bg-[#7b5e53]"
                            onClick={() => navigate(`/servicios/${servicio.id}/habilidades`)}
                          >
                            Habilidades
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-[#795548] text-white hover:bg-[#6d4c41]"
                            onClick={() => navigate(`/servicios/${servicio.id}/sectores`)}
                          >
                            Sectores
                          </Button>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ServiciosList
