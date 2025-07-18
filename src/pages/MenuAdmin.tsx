"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  Scissors,
  Building,
  MapPin,
  Brain,
  Clock,
  BarChart3,
  Settings,
  User,
  Sparkles,
} from "lucide-react"

// Organización de opciones por categorías
const adminSections = [
  {
    title: "Gestión Principal",
    icon: Settings,
    color: "from-blue-500 to-blue-600",
    options: [
      {
        label: "Empleados",
        path: "/empleados",
        icon: Users,
        description: "Gestionar personal y perfiles",
        color: "bg-blue-500",
      },
      {
        label: "Gestión de Turnos",
        path: "/asignarTurno",
        icon: Calendar,
        description: "Programar y administrar citas",
        color: "bg-green-500",
      },
    ],
  },
  {
    title: "Configuración",
    icon: Settings,
    color: "from-purple-500 to-purple-600",
    options: [
      {
        label: "Servicios",
        path: "/servicios",
        icon: Scissors,
        description: "Catálogo de servicios disponibles",
        color: "bg-purple-500",
      },
      {
        label: "Sucursales",
        path: "/sucursales",
        icon: Building,
        description: "Ubicaciones y sedes",
        color: "bg-orange-500",
      },
      {
        label: "Sectores",
        path: "/sectores",
        icon: MapPin,
        description: "Áreas de trabajo",
        color: "bg-teal-500",
      },
      {
        label: "Habilidades",
        path: "/habilidades",
        icon: Brain,
        description: "Competencias del personal",
        color: "bg-pink-500",
      },
      {
        label: "Períodos Laborales",
        path: "/periodos-laborales",
        icon: Clock,
        description: "Horarios de trabajo",
        color: "bg-indigo-500",
      },
    ],
  },
  {
    title: "Análisis",
    icon: BarChart3,
    color: "from-emerald-500 to-emerald-600",
    options: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: BarChart3,
        description: "Métricas y estadísticas",
        color: "bg-emerald-500",
      },
      {
        label: "",
        path: "",
        icon: BarChart3,
        description: "Próximamente disponible",
        color: "bg-gray-400",
        disabled: true,
      },
    ],
  },
]

const MenuAdmin: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f4e9e1] p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-[#a1887f] to-[#8d6e63] rounded-full">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#6d4c41] mb-2">Panel de Administración</h1>
            <p className="text-[#8d6e63] text-lg">Gestiona tu negocio desde un solo lugar</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-[#a1887f]" />
          <Badge variant="secondary" className="bg-[#a1887f]/10 text-[#6d4c41] border-[#a1887f]/20">
            Sistema JMBROWS
          </Badge>
          <Sparkles className="h-5 w-5 text-[#a1887f]" />
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {adminSections.map((section, sectionIndex) => (
            <motion.div key={sectionIndex} className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 bg-gradient-to-r ${section.color} rounded-lg`}>
                  <section.icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-[#6d4c41]">{section.title}</h2>
              </div>

              {/* Options Cards */}
              <div className="space-y-3">
                {section.options.map((option, optionIndex) => (
                  <motion.div
                    key={optionIndex}
                    whileHover={{
                      scale: option.disabled ? 1 : 1.02,
                      transition: { type: "spring", stiffness: 400, damping: 10 },
                    }}
                    whileTap={{ scale: option.disabled ? 1 : 0.98 }}
                  >
                    <Card
                      className={`
                      border border-[#e0d6cf] shadow-md hover:shadow-lg transition-all duration-300
                      ${
                        option.disabled
                          ? "opacity-60 cursor-not-allowed bg-gray-50"
                          : "bg-white hover:bg-[#fdf6f1] cursor-pointer"
                      }
                    `}
                    >
                      <CardContent className="p-4">
                        {option.disabled ? (
                          <div className="flex items-center gap-3">
                            <div className={`p-2 ${option.color} rounded-lg`}>
                              <option.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#6d4c41] mb-1">{option.label}</h3>
                              <p className="text-sm text-[#8d6e63]">{option.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Próximamente
                            </Badge>
                          </div>
                        ) : (
                          <Link to={option.path} className="block">
                            <div className="flex items-center gap-3 group">
                              <div
                                className={`p-2 ${option.color} rounded-lg group-hover:scale-110 transition-transform duration-200`}
                              >
                                <option.icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-[#6d4c41] mb-1 group-hover:text-[#a1887f] transition-colors">
                                  {option.label}
                                </h3>
                                <p className="text-sm text-[#8d6e63]">{option.description}</p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-2 h-2 bg-[#a1887f] rounded-full"></div>
                              </div>
                            </div>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-[#8d6e63] text-sm">© 2024 JMBROWS - Sistema de Gestión</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default MenuAdmin
