import React, { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { motion } from "framer-motion"

interface Habilidad {
  id: number
  nombre: string
  descripcion: string
}

const HabilidadesList: React.FC = () => {
  const [habilidades, setHabilidades] = useState<Habilidad[]>([])
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("/api/Habilidad")
      .then((res) => setHabilidades(res.data))
      .catch(() => setError("Error al cargar habilidades"))
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta habilidad?")) return
    try {
      await axios.delete(`/api/Habilidad/${id}`)
      setHabilidades(habilidades.filter((h) => h.id !== id))
    } catch {
      setError("No se pudo eliminar la habilidad")
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-[#fdf6f1] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-[#fdf6f1] border border-[#e0d6cf]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6d4c41]">Habilidades</CardTitle>
            <div className="mt-2">
              <motion.div 
                className="inline-block origin-left"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                  onClick={() => navigate("/habilidades/nueva")}
                >
                  + Nueva Habilidad
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
                    <th className="p-3 text-left">Descripción</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {habilidades.map((habilidad) => (
                    <tr key={habilidad.id} className="border-t border-[#e0d6cf]">
                      <td className="p-3">{habilidad.nombre}</td>
                      <td className="p-3">{habilidad.descripcion}</td>
                      <td className="p-3 flex justify-center gap-2 flex-wrap">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-[#6d4c41] text-white hover:bg-[#5d4037]"
                            onClick={() => navigate(`/habilidades/editar/${habilidad.id}`)}
                          >
                            Editar
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(habilidad.id)}
                          >
                            Eliminar
                          </Button>
                        </motion.div>
                      </td>
                    </tr>
                  ))}
                  {habilidades.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        No hay habilidades registradas.
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

export default HabilidadesList