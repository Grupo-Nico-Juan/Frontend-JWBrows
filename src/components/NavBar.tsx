"use client"

import type React from "react"

import {
  IconLayoutDashboard,
  IconUsers,
  IconCalendarCheck,
  IconLogout,
  IconGauge,
  IconClock,
  IconScissors,
  IconBuilding,
  IconMapPin,
  IconTool,
  IconChevronDown,
  IconMenu2,
  IconX,
} from "@tabler/icons-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

export const NavBar: React.FC = () => {
  const { usuario, logout } = useAuth() as {
    usuario: { tipoUsuario: string; email?: string } | null
    logout: () => void
  }
  const navigate = useNavigate()
  const location = useLocation()
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  if (!usuario) return null

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Función para verificar si una ruta está activa
  const isActiveRoute = (path: string) => location.pathname === path

  // Configuración de menús organizados por categorías
  const menuItems = {
    gestion: [
      {
        title: "Empleados",
        path: "/empleados",
        icon: IconUsers,
        description: "Gestión de personal",
      },
      {
        title: "Gestión Turnos",
        path: "/asignarTurno",
        icon: IconCalendarCheck,
        description: "Programación de citas",
      },
    ],
    configuracion: [
      {
        title: "Períodos Laborales",
        path: "/periodos-laborales",
        icon: IconClock,
        description: "Horarios de trabajo",
      },
      {
        title: "Servicios",
        path: "/servicios",
        icon: IconScissors,
        description: "Catálogo de servicios",
      },
      {
        title: "Sucursales",
        path: "/sucursales",
        icon: IconBuilding,
        description: "Ubicaciones",
      },
      {
        title: "Sectores",
        path: "/sectores",
        icon: IconMapPin,
        description: "Áreas de trabajo",
      },
      {
        title: "Habilidades",
        path: "/habilidades",
        icon: IconTool,
        description: "Competencias del personal",
      },
    ],
    reportes: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: IconGauge,
        description: "Métricas y análisis",
      },
    ],
  }

  const getInitials = (email: string) => {
    return email.split("@")[0].substring(0, 2).toUpperCase()
  }

  return (
    <>
      {/* Menú móvil */}
      {isMobile ? (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm border border-[#e7d9cd] shadow-lg hover:bg-[#f4e9e1] transition-all"
            >
              <IconMenu2 className="h-6 w-6 text-[#7a5b4c]" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 p-0 bg-gradient-to-b from-[#fffaf5] to-[#fdf6f1] border-r border-[#e7d9cd] [&>button]:hidden"
          >
            {/* Títulos ocultos para accesibilidad */}
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <SheetDescription className="sr-only">
              Menú principal de navegación del sistema JMBROWS con acceso a gestión, configuración y análisis
            </SheetDescription>

            {/* Header móvil */}
            <div className="border-b border-[#e7d9cd]/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#a1887f] rounded-lg flex-shrink-0">
                      <IconLayoutDashboard className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-lg font-bold text-[#7a5b4c] leading-tight block">JMBROWS</span>
                      <p className="text-xs text-[#8d6e63] leading-tight">Sistema de Gestión</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-8 w-8"
                  aria-label="Cerrar menú"
                >
                  <IconX className="h-4 w-4 text-[#7a5b4c]" />
                </Button>
              </div>
            </div>

            {/* Contenido móvil */}
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {usuario.tipoUsuario === "Administrador" && (
                  <>
                    {/* Gestión Principal */}
                    <div>
                      <h3 className="text-[#8d6e63] font-semibold text-xs uppercase tracking-wider mb-3">
                        Gestión Principal
                      </h3>
                      <div className="space-y-2">
                        {menuItems.gestion.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                              isActiveRoute(item.path) ? "bg-[#a1887f] text-white" : "hover:bg-[#f4e9e1] text-[#7a5b4c]"
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            <div>
                              <span className="font-medium">{item.title}</span>
                              <p className="text-xs opacity-75">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Configuración */}
                    <div>
                      <button
                        onClick={() => setIsConfigOpen(!isConfigOpen)}
                        className="flex items-center justify-between w-full text-[#8d6e63] font-semibold text-xs uppercase tracking-wider mb-3 hover:text-[#7a5b4c] transition-colors"
                        aria-expanded={isConfigOpen}
                        aria-label="Expandir menú de configuración"
                      >
                        Configuración
                        <IconChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${isConfigOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {isConfigOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 overflow-hidden"
                          >
                            {menuItems.configuracion.map((item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                                  isActiveRoute(item.path)
                                    ? "bg-[#a1887f] text-white"
                                    : "hover:bg-[#f4e9e1] text-[#7a5b4c]"
                                }`}
                              >
                                <item.icon className="h-4 w-4" />
                                <div>
                                  <span className="text-sm">{item.title}</span>
                                  <p className="text-xs opacity-75">{item.description}</p>
                                </div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Análisis */}
                    <div>
                      <h3 className="text-[#8d6e63] font-semibold text-xs uppercase tracking-wider mb-3">Análisis</h3>
                      <div className="space-y-2">
                        {menuItems.reportes.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                              isActiveRoute(item.path) ? "bg-[#a1887f] text-white" : "hover:bg-[#f4e9e1] text-[#7a5b4c]"
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            <div>
                              <span className="font-medium">{item.title}</span>
                              <p className="text-xs opacity-75">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer móvil */}
              <div className="border-t border-[#e7d9cd]/50 p-4 space-y-3">
                {/* Info usuario */}
                <div className="flex items-center gap-3 px-3 py-2 bg-[#f8f0ec] rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#a1887f] text-white text-sm">
                      {usuario.email ? getInitials(usuario.email) : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#6d4c41] truncate">
                      {usuario.email?.split("@")[0] || "Administrador"}
                    </p>
                    <p className="text-xs text-[#8d6e63]">{usuario.tipoUsuario}</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="flex items-center gap-3 px-3 py-3 w-full text-[#a1452f] hover:bg-[#a1452f] hover:text-white transition-all rounded-lg"
                >
                  <IconLogout className="h-5 w-5" />
                  <span className="font-medium">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        // Sidebar desktop (código original)
        <Sidebar className="h-screen border-r border-[#e7d9cd] bg-gradient-to-b from-[#fffaf5] to-[#fdf6f1] text-[#7a5b4c] shadow-lg">
          {/* Todo el código original del sidebar desktop aquí */}
          <SidebarHeader className="border-b border-[#e7d9cd]/50 pb-4 px-3">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:bg-[#f4e9e1] transition-all duration-300 rounded-lg p-2">
                    <Link to="/menu-admin" className="flex items-center gap-2 text-[#7a5b4c] hover:text-[#5d3f2d]">
                      <div className="p-1.5 bg-[#a1887f] rounded-lg flex-shrink-0">
                        <IconLayoutDashboard className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-lg font-bold leading-tight block">JMBROWS</span>
                        <p className="text-xs text-[#8d6e63] leading-tight">Sistema de Gestión</p>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </motion.div>
          </SidebarHeader>

          <SidebarContent className="py-4">
            {usuario.tipoUsuario === "Administrador" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                {/* Sección de Gestión */}
                <SidebarGroup>
                  <SidebarGroupLabel className="text-[#8d6e63] font-semibold text-xs uppercase tracking-wider">
                    Gestión Principal
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menuItems.gestion.map((item, index) => (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        >
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              isActive={isActiveRoute(item.path)}
                              className="hover:bg-[#f4e9e1] transition-all duration-300 rounded-lg group min-h-[60px] py-2"
                            >
                              <Link to={item.path} className="flex items-center gap-3 px-2 py-2">
                                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span className="font-medium text-sm leading-tight">{item.title}</span>
                                  <p className="text-xs text-[#8d6e63] group-hover:text-[#7a5b4c] transition-colors leading-tight mt-0.5">
                                    {item.description}
                                  </p>
                                </div>
                                {isActiveRoute(item.path) && (
                                  <Badge className="bg-[#a1887f] text-white text-xs flex-shrink-0">Activo</Badge>
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </motion.div>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Sección de Configuración Colapsible */}
                <SidebarGroup>
                  <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                    <SidebarGroupLabel asChild>
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-[#8d6e63] font-semibold text-xs uppercase tracking-wider hover:text-[#7a5b4c] transition-colors">
                        Configuración
                        <IconChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${isConfigOpen ? "rotate-180" : ""}`}
                        />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          <AnimatePresence>
                            {isConfigOpen &&
                              menuItems.configuracion.map((item, index) => (
                                <motion.div
                                  key={item.path}
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                  <SidebarMenuItem>
                                    <SidebarMenuButton
                                      asChild
                                      isActive={isActiveRoute(item.path)}
                                      className="hover:bg-[#f4e9e1] transition-all duration-300 rounded-lg group min-h-[50px] py-1"
                                    >
                                      <Link to={item.path} className="flex items-center gap-3 px-2 py-2">
                                        <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <span className="text-sm leading-tight">{item.title}</span>
                                          <p className="text-xs text-[#8d6e63] group-hover:text-[#7a5b4c] transition-colors leading-tight mt-0.5">
                                            {item.description}
                                          </p>
                                        </div>
                                        {isActiveRoute(item.path) && (
                                          <Badge className="bg-[#a1887f] text-white text-xs flex-shrink-0">
                                            Activo
                                          </Badge>
                                        )}
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarGroup>

                {/* Sección de Reportes */}
                <SidebarGroup>
                  <SidebarGroupLabel className="text-[#8d6e63] font-semibold text-xs uppercase tracking-wider">
                    Análisis
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menuItems.reportes.map((item, index) => (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        >
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              isActive={isActiveRoute(item.path)}
                              className="hover:bg-[#f4e9e1] transition-all duration-300 rounded-lg group min-h-[60px] py-2"
                            >
                              <Link to={item.path} className="flex items-center gap-3 px-2 py-2">
                                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span className="font-medium text-sm leading-tight">{item.title}</span>
                                  <p className="text-xs text-[#8d6e63] group-hover:text-[#7a5b4c] transition-colors leading-tight mt-0.5">
                                    {item.description}
                                  </p>
                                </div>
                                {isActiveRoute(item.path) && (
                                  <Badge className="bg-[#a1887f] text-white text-xs flex-shrink-0">Activo</Badge>
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </motion.div>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </motion.div>
            )}
          </SidebarContent>

          {/* Footer con información del usuario y logout */}
          <SidebarFooter className="border-t border-[#e7d9cd]/50 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <SidebarMenu>
                {/* Información del usuario */}
                <SidebarMenuItem>
                  <div className="flex items-center gap-3 px-3 py-2 bg-[#f8f0ec] rounded-lg mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#a1887f] text-white text-sm">
                        {usuario.email ? getInitials(usuario.email) : "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#6d4c41] truncate">
                        {usuario.email?.split("@")[0] || "Administrador"}
                      </p>
                      <p className="text-xs text-[#8d6e63]">{usuario.tipoUsuario}</p>
                    </div>
                  </div>
                </SidebarMenuItem>

                {/* Botón de logout */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-[#a1452f] hover:bg-[#a1452f] hover:text-white transition-all duration-300 rounded-lg group"
                  >
                    <IconLogout className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Cerrar sesión</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </motion.div>
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  )
}
