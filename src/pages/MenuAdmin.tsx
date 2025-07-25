"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Users, Calendar, Scissors, Building, MapPin, Brain, Clock, BarChart3, Settings, UserX } from "lucide-react"
import MenuHeader from "@/components/menu/menu-header"
import MenuSection from "@/components/menu/menu-section"
import MenuOptionCard from "@/components/menu/menu-option-card"
import MotionWrapper from "@/components/animations/motion-wrapper"

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
      {
        label: "Licencias Multiples",
        path: "/licencias-multiples",
        icon: UserX,
        description: "Asignar licencias por sucursal",
        color: "bg-red-500",
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
        label: "Reportes Avanzados",
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
      <MenuHeader
        title="Panel de Administración"
        subtitle="Gestiona tu negocio desde un solo lugar"
        systemName="Sistema JMBROWS"
      />

      {/* Main Content */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {adminSections.map((section, sectionIndex) => (
            <MenuSection key={sectionIndex} title={section.title} icon={section.icon} color={section.color}>
              {section.options.map((option, optionIndex) => (
                <MenuOptionCard
                  key={optionIndex}
                  label={option.label}
                  path={option.path}
                  icon={option.icon}
                  description={option.description}
                  color={option.color}
                  disabled={option.disabled}
                />
              ))}
            </MenuSection>
          ))}
        </div>

        {/* Footer */}
        <MotionWrapper animation="fadeIn" delay={1} duration={0.6} className="mt-8 text-center">
          <p className="text-[#8d6e63] text-sm">© 2024 JMBROWS - Sistema de Gestión Integral</p>
        </MotionWrapper>
      </motion.div>
    </div>
  )
}

export default MenuAdmin
