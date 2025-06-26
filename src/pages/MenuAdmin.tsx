import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const adminOptions = [
  { label: "👤 Empleados", path: "/empleados" },
  { label: "📅 Turnos", path: "/asignarTurno" },
  { label: "🧴 Servicios", path: "/servicios" },
  { label: "🏢 Sucursales", path: "/sucursales" },
  { label: "🏷️ Sectores", path: "/sectores" },
  { label: "🧠 Habilidades", path: "/habilidades" },
  { label: "🕒 Periodos Laborales", path: "/periodos-laborales" },
  { label: "📊 Reportes (próximamente)", path: "", disabled: true },
];

const MenuAdmin: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-lg border border-[#e0d6cf] bg-[#fdf6f1]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6d4c41]">
              Menú Administrador
            </CardTitle>
            <p className="text-[#5d4037] text-sm mt-2">
              Seleccioná una opción para gestionar:
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminOptions.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: option.disabled ? 1 : 1.03 }}
                whileTap={{ scale: option.disabled ? 1 : 0.97 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {option.disabled ? (
                  <Button disabled className="w-full opacity-60 cursor-not-allowed bg-[#e0d6cf] text-[#5d4037]" >
                    {option.label}
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-[#a1887f] text-white hover:bg-[#8d6e63]" >
                    <Link to={option.path}>{option.label}</Link>
                  </Button>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MenuAdmin;