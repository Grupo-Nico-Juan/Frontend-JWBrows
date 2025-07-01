"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "../api/AxiosInstance"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Settings,
  MapPin,
  Clock,
  Mail,
  Filter,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
} from "lucide-react"

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
  const [filteredEmpleados, setFilteredEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCargo, setSelectedCargo] = useState<string>("todos")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  useEffect(() => {
    if (!usuario || usuario.tipoUsuario !== "Administrador") {
      navigate("/")
      return
    }

    const fetchEmpleados = async () => {
      setLoading(true)
      try {
        const res = await axios.get<Empleado[]>("/api/Empleado")
        setEmpleados(res.data)
        setFilteredEmpleados(res.data)
      } catch (err) {
        setError("Error al cargar empleados")
      } finally {
        setLoading(false)
      }
    }

    fetchEmpleados()
  }, [usuario, navigate])

  // Filtrar empleados
  useEffect(() => {
    let filtered = empleados

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.cargo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por cargo
    if (selectedCargo !== "todos") {
      filtered = filtered.filter((emp) => emp.cargo === selectedCargo)
    }

    setFilteredEmpleados(filtered)
  }, [empleados, searchTerm, selectedCargo])

  const handleDelete = async (id: number, nombre: string, apellido: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${nombre} ${apellido}?`)) return

    try {
      await axios.delete(`/api/Empleado/${id}`)
      setEmpleados((prev) => prev.filter((e) => e.id !== id))
    } catch {
      setError("No se pudo eliminar el empleado")
    }
  }

  // Obtener cargos únicos
  const cargosUnicos = Array.from(new Set(empleados.map((emp) => emp.cargo)))

  // Obtener iniciales para avatar
  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  // Obtener color del cargo
  const getCargoColor = (cargo: string) => {
    const colors = {
      Administrador: "bg-red-100 text-red-800",
      Gerente: "bg-blue-100 text-blue-800",
      Empleado: "bg-green-100 text-green-800",
      Supervisor: "bg-purple-100 text-purple-800",
      default: "bg-gray-100 text-gray-800",
    }
    return colors[cargo as keyof typeof colors] || colors.default
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#a1887f]" />
            <span className="text-[#6d4c41] font-medium">Cargando empleados...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg border border-[#e0d6cf] p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a1887f] rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6d4c41]">Gestión de Empleados</h1>
                <p className="text-[#8d6e63]">
                  {filteredEmpleados.length} de {empleados.length} empleados
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/empleados/nuevo")}
                className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Empleado
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-[#e0d6cf]">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Búsqueda */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8d6e63]" />
                  <Input
                    placeholder="Buscar por nombre, email o cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-[#d2bfae] focus:ring-[#a1887f] focus:border-[#a1887f]"
                  />
                </div>

                {/* Filtro por cargo */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#8d6e63]" />
                  <select
                    value={selectedCargo}
                    onChange={(e) => setSelectedCargo(e.target.value)}
                    className="px-3 py-2 border border-[#d2bfae] rounded-md text-[#6d4c41] bg-white focus:ring-2 focus:ring-[#a1887f] focus:border-transparent"
                  >
                    <option value="todos">Todos los cargos</option>
                    {cargosUnicos.map((cargo) => (
                      <option key={cargo} value={cargo}>
                        {cargo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Toggle de vista */}
                <div className="flex items-center gap-1 bg-[#f8f0ec] rounded-lg p-1">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className={viewMode === "table" ? "bg-[#a1887f] text-white" : "text-[#8d6e63]"}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-[#a1887f] text-white" : "text-[#8d6e63]"}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}

        {/* Contenido principal */}
        <AnimatePresence mode="wait">
          {filteredEmpleados.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Card className="bg-white/60 backdrop-blur-sm border-[#e0d6cf] p-8">
                <Users className="h-16 w-16 text-[#d2bfae] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">
                  {searchTerm || selectedCargo !== "todos" ? "No se encontraron empleados" : "No hay empleados"}
                </h3>
                <p className="text-[#8d6e63] mb-4">
                  {searchTerm || selectedCargo !== "todos"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza agregando tu primer empleado"}
                </p>
                {!searchTerm && selectedCargo === "todos" && (
                  <Button
                    onClick={() => navigate("/empleados/nuevo")}
                    className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Empleado
                  </Button>
                )}
              </Card>
            </motion.div>
          ) : viewMode === "table" ? (
            /* Vista de tabla */
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#f3e5e1] hover:bg-[#f3e5e1]">
                          <TableHead className="text-[#6d4c41] font-semibold">Empleado</TableHead>
                          <TableHead className="text-[#6d4c41] font-semibold">Email</TableHead>
                          <TableHead className="text-[#6d4c41] font-semibold">Cargo</TableHead>
                          <TableHead className="text-[#6d4c41] font-semibold text-center">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmpleados.map((emp, index) => (
                          <motion.tr
                            key={emp.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-[#f8f0ec] transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-[#a1887f] text-white text-sm">
                                    {getInitials(emp.nombre, emp.apellido)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-[#6d4c41]">
                                    {emp.nombre} {emp.apellido}
                                  </div>
                                  <div className="text-sm text-[#8d6e63]">ID: {emp.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-[#8d6e63]" />
                                <span className="text-[#6d4c41]">{emp.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getCargoColor(emp.cargo)}>{emp.cargo}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => navigate(`/empleados/editar/${emp.id}`)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate(`/empleados/${emp.id}/habilidades`)}>
                                      <Settings className="h-4 w-4 mr-2" />
                                      Habilidades
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/empleados/${emp.id}/sectores`)}>
                                      <MapPin className="h-4 w-4 mr-2" />
                                      Sectores
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => navigate(`/periodos-laborales?empleadaId=${emp.id}`)}
                                    >
                                      <Clock className="h-4 w-4 mr-2" />
                                      Períodos
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(emp.id, emp.nombre, emp.apellido)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Vista de grid */
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredEmpleados.map((emp, index) => (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf] hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarFallback className="bg-[#a1887f] text-white text-lg">
                            {getInitials(emp.nombre, emp.apellido)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-[#6d4c41] text-lg">
                          {emp.nombre} {emp.apellido}
                        </h3>
                        <p className="text-sm text-[#8d6e63] flex items-center justify-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {emp.email}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#8d6e63]">Cargo:</span>
                          <Badge className={getCargoColor(emp.cargo)}>{emp.cargo}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#8d6e63]">ID:</span>
                          <span className="text-sm font-medium text-[#6d4c41]">{emp.id}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#e0d6cf]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full border-[#d2bfae] text-[#6d4c41] hover:bg-[#f8f0ec] bg-transparent"
                            >
                              <MoreVertical className="h-4 w-4 mr-2" />
                              Acciones
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => navigate(`/empleados/editar/${emp.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate(`/empleados/${emp.id}/habilidades`)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Habilidades
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/empleados/${emp.id}/sectores`)}>
                              <MapPin className="h-4 w-4 mr-2" />
                              Sectores
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/periodos-laborales?empleadaId=${emp.id}`)}>
                              <Clock className="h-4 w-4 mr-2" />
                              Períodos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(emp.id, emp.nombre, emp.apellido)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EmpleadosList
