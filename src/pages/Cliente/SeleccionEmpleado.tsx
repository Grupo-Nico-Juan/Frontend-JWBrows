import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import axios from "@/api/AxiosInstance"

interface Empleado {
  id: number
  nombre: string
  apellido: string
}

const SeleccionEmpleado: React.FC = () => {
  const navigate = useNavigate()
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)

  const sucursal = JSON.parse(localStorage.getItem("sucursalSeleccionada") || "{}")
  const servicioId = localStorage.getItem("servicioSeleccionado")
  const fechaHora = localStorage.getItem("fechaHoraSeleccionada")

  useEffect(() => {
    if (!sucursal?.id || !servicioId || !fechaHora) {
      navigate("/") // Redirige si falta algo
      return
    }

    axios
      .get(`/api/Empleado`, {
        params: {
          sucursalId: sucursal.id,
          servicioId,
          fechaHora,
        },
      })
      .then((res) => setEmpleados(res.data))
      .catch((err) => console.error("Error cargando empleados", err))
      .then(() => setLoading(false))
  }, [])

  const handleSeleccion = (empleado: Empleado) => {
    localStorage.setItem("empleadoSeleccionado", JSON.stringify(empleado))
    navigate("/reserva/confirmar")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1]">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-4 bg-[#fffaf5] border border-[#e6dcd4] shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6e4b3a]">Seleccioná un profesional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p>Cargando empleados...</p>
            ) : empleados.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay empleados disponibles en ese horario.
              </p>
            ) : (
              empleados.map((emp) => (
                <motion.div
                  key={emp.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="btn-jmbrows w-full justify-start"
                    onClick={() => handleSeleccion(emp)}
                  >
                    {emp.nombre} {emp.apellido}
                  </Button>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default SeleccionEmpleado