import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

interface Sector {
  id: number
  nombre: string
  descripcion: string
  sucursalId: number
}

const AsignarSectoresEmpleado: React.FC = () => {
  const { id } = useParams()
  const empleadoId = Number(id)
  const [sectores, setSectores] = useState<Sector[]>([])
  const [asignados, setAsignados] = useState<number[]>([])
  const navigate = useNavigate()

  const fetchSectores = async () => {
    try {
      const [todos, actuales] = await Promise.all([
        axios.get<Sector[]>("/api/Sector"),
        axios.get<Sector[]>(`/api/Empleado/${empleadoId}/sectores`),
      ])
      setSectores(todos.data)
      setAsignados(actuales.data.map((s) => s.id))
    } catch (error) {
      toast.error("Error al cargar los sectores")
    }
  }

  const toggleAsignacion = async (sectorId: number, asignado: boolean) => {
    try {
      if (asignado) {
        await axios.delete(`/api/Empleado/${empleadoId}/sectores/${sectorId}`)
        toast.success("Sector quitado")
      } else {
        await axios.post(`/api/Empleado/${empleadoId}/sectores/${sectorId}`)
        toast.success("Sector asignado")
      }
      fetchSectores()
    } catch {
      toast.error("Error al modificar el sector")
    }
  }

  useEffect(() => {
    fetchSectores()
  }, [empleadoId])

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#fdf6f1] p-4">
      <Card className="w-full max-w-3xl bg-[#fffaf5] border border-[#e6dcd4] shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#6d4c41]">Asignar Sectores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f3e5e1]">
                <TableHead>Sector</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Asignado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectores.map((sector) => {
                const estaAsignado = asignados.includes(sector.id)
                return (
                  <TableRow key={sector.id}>
                    <TableCell>{sector.nombre}</TableCell>
                    <TableCell>{sector.descripcion}</TableCell>
                    <TableCell>{estaAsignado ? "Sí" : "No"}</TableCell>
                    <TableCell>
                      <Button
                        className={estaAsignado ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                        onClick={() => toggleAsignacion(sector.id, estaAsignado)}
                      >
                        {estaAsignado ? "Quitar" : "Asignar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Button className="bg-[#6d4c41] text-white hover:bg-[#5d4037]" onClick={() => navigate("/empleados")}>
              Volver a lista
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AsignarSectoresEmpleado
