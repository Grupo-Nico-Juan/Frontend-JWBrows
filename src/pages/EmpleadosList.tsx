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
import { Users, Plus, Search, MoreVertical, Edit, Trash2, Settings, MapPin, Clock, Mail, Filter, Grid3X3, List, Loader2, AlertCircle, Palette } from 'lucide-react'

interface Empleado {
  id: number
  nombre: string
  apellido: string
  cargo: string
  color: string
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
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] flex items-center justify-center">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#d4bfae] rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#a37e63] rounded-full opacity-10 blur-3xl"></div>
        </div>
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e1cfc0] shadow-2xl">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#7a5b4c]" />
            <span className="text-[#7a5b4c] font-medium">Cargando empleados...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] p-6">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#d4bfae] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#a37e63] rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-[#e1cfc0] p-6 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#7a5b4c]">Gestión de Empleados</h1>
                <p className="text-[#8d6e63]">
                  {filteredEmpleados.length} de {empleados.length} empleados
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/empleados/nuevo")}
                className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#e1cfc0] shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Búsqueda */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8d6e63]" />
                  <Input
                    placeholder="Buscar por nombre, email o cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#fdf6f1] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
                  />
                </div>
                {/* Filtro por cargo */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#8d6e63]" />
                  <select
                    value={selectedCargo}
                    onChange={(e) => setSelectedCargo(e.target.value)}
                    className="px-3 py-2 border-2 border-[#e1cfc0] rounded-xl text-[#7a5b4c] bg-[#fdf6f1] focus:ring-2 focus:ring-[#a37e63] focus:border-[#a37e63] transition-all duration-200"
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
                <div className="flex items-center gap-1 bg-[#f8f0ec] rounded-xl p-1 border border-[#e1cfc0]">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className={
                      viewMode === "table"
                        ? "bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] text-white shadow-md"
                        : "text-[#8d6e63] hover:bg-[#e1cfc0]"
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] text-white shadow-md"
                        : "text-[#8d6e63] hover:bg-[#e1cfc0]"
                    }
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
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-lg"
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700 font-medium">{error}</span>
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
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#e1cfc0] p-8 shadow-lg">
                <Users className="h-16 w-16 text-[#d4bfae] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#7a5b4c] mb-2">
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
                    className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#e1cfc0] shadow-lg">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-[#f8f0ec] to-[#f3e9dc] hover:from-[#f8f0ec] hover:to-[#f3e9dc] border-b-2 border-[#e1cfc0]">
                          <TableHead className="text-[#7a5b4c] font-bold">Empleado</TableHead>
                          <TableHead className="text-[#7a5b4c] font-bold">Cargo</TableHead>
                          <TableHead className="text-[#7a5b4c] font-bold">Color</TableHead>
                          <TableHead className="text-[#7a5b4c] font-bold text-center">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmpleados.map((emp, index) => (
                          <motion.tr
                            key={emp.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-[#f8f0ec] transition-colors border-b border-[#e1cfc0]/50"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 shadow-md">
                                  <AvatarFallback
                                    className="text-white text-sm font-semibold"
                                    style={{ backgroundColor: emp.color || "#7a5b4c" }}
                                  >
                                    {getInitials(emp.nombre, emp.apellido)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-[#7a5b4c]">
                                    {emp.nombre} {emp.apellido}
                                  </div>
                                  <div className="text-sm text-[#8d6e63]">ID: {emp.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getCargoColor(emp.cargo)}>{emp.cargo}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                                  style={{ backgroundColor: emp.color || "#7a5b4c" }}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#e1cfc0]">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border-[#e1cfc0]">
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
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#e1cfc0] hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <Avatar className="h-16 w-16 mx-auto mb-3 shadow-lg">
                          <AvatarFallback
                            className="text-white text-lg font-semibold"
                            style={{ backgroundColor: emp.color || "#7a5b4c" }}
                          >
                            {getInitials(emp.nombre, emp.apellido)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-[#7a5b4c] text-lg">
                          {emp.nombre} {emp.apellido}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#8d6e63]">Cargo:</span>
                          <Badge className={getCargoColor(emp.cargo)}>{emp.cargo}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#8d6e63]">Color:</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: emp.color || "#7a5b4c" }}
                            />
                            <span className="text-xs font-mono text-[#8d6e63]">{emp.color || "#7a5b4c"}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#8d6e63]">ID:</span>
                          <span className="text-sm font-medium text-[#7a5b4c]">{emp.id}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#e1cfc0]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full border-2 border-[#e1cfc0] text-[#7a5b4c] hover:bg-[#f8f0ec] bg-transparent hover:border-[#a37e63] transition-all duration-200"
                            >
                              <MoreVertical className="h-4 w-4 mr-2" />
                              Acciones
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border-[#e1cfc0]">
                            <DropdownMenuItem onClick={() => navigate(`/empleado-form/${emp.id}`)}>
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

