import React, { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { motion } from "framer-motion"

interface Sucursal {
  id: number
  nombre: string
  direccion: string
  telefono: string
}

const SucursalesList: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    axios.get("/api/Sucursal")
      .then(res => setSucursales(res.data))
      .catch(() => setError("Error al cargar sucursales"))
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta sucursal?")) return
    try {
      await axios.delete(`/api/Sucursal/${id}`)
      setSucursales(sucursales.filter(s => s.id !== id))
    } catch {
      setError("No se pudo eliminar la sucursal")
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-[#fdf6f1] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl"
      >
        <Card className="bg-[#fdf6f1] border border-[#e0d6cf]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6d4c41]">Sucursales</CardTitle>
            <div className="mt-2">
              <motion.div
                className="inline-block origin-left"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                  onClick={() => navigate("/sucursales/nueva")}
                >
                  + Nueva Sucursal
                </Button>
              </motion.div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#f3e5e1] text-[#6d4c41]">
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Dirección</th>
                    <th className="p-3 text-left">Teléfono</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sucursales.map((sucursal) => (
                    <tr key={sucursal.id} className="border-t border-[#e0d6cf]">
                      <td className="p-3">{sucursal.nombre}</td>
                      <td className="p-3">{sucursal.direccion}</td>
                      <td className="p-3">{sucursal.telefono}</td>
                      <td className="p-3 text-center flex flex-wrap justify-center gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-[#6d4c41] text-white hover:bg-[#5d4037]"
                            onClick={() => navigate(`/sucursales/editar/${sucursal.id}`)}
                          >
                            Editar
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(sucursal.id)}
                          >
                            Eliminar
                          </Button>
                        </motion.div>
                      </td>
                    </tr>
                  ))}
                  {sucursales.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500">
                        No hay sucursales registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default SucursalesList