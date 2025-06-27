import React, { useEffect, useState } from "react"
import axios from "../api/AxiosInstance"
import { useAuth } from "../context/AuthContext"
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
import { motion } from "framer-motion";

interface Empleado {
  id: number
  nombre: string
  apellido: string
  email: string
  cargo: string
}

interface Usuario {
  tipoUsuario: string
}

const EmpleadosList: React.FC = () => {
  const { usuario } = useAuth() as { usuario: Usuario | null }
  const navigate = useNavigate()
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!usuario || usuario.tipoUsuario !== "Administrador") {
      navigate("/")
      return
    }
    const fetchEmpleados = async () => {
      try {
        const res = await axios.get<Empleado[]>("/api/Empleado")
        setEmpleados(res.data)
      } catch (err) {
        setError("Error al cargar empleados")
      }
    }
    fetchEmpleados()
  }, [usuario, navigate])

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar empleado?")) return
    try {
      await axios.delete(`/api/Empleado/${id}`);
      setEmpleados((prev) => prev.filter((e) => e.id !== id))
    } catch {
      setError("No se pudo eliminar el empleado")
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
            <CardTitle className="text-2xl text-[#6d4c41]">Empleados</CardTitle>
            <div className="mt-2">
              <motion.div className="inline-block origin-left" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className=" bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                  onClick={() => navigate("/empleados/nuevo")}
                >
                  Nuevo Empleado
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
                    <TableHead>Apellido</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empleados.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.nombre}</TableCell>
                      <TableCell>{emp.apellido}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.cargo}</TableCell>
                      <TableCell className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" className="bg-[#6d4c41] text-white hover:bg-[#5d4037]" onClick={() => navigate(`/empleados/editar/${emp.id}`)} >
                            Editar
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(emp.id)} >
                            Eliminar
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-[#8d6e63] text-white hover:bg-[#7b5e53]"
                            onClick={() => navigate(`/empleados/${emp.id}/habilidades`)}
                          >
                            Habilidades
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-[#795548] text-white hover:bg-[#6d4c41]"
                            onClick={() => navigate(`/empleados/${emp.id}/sectores`)}
                          >
                            Sectores
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="btn-jmbrows"
                            onClick={() => navigate(`/periodos-laborales?empleadaId=${emp.id}`)}
                          >
                            Periodos
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

export default EmpleadosList
