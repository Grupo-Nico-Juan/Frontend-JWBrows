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
            <CardTitle className="text-2xl text-[#6d4c41]">Menú Administrador</CardTitle>
            <p className="text-[#5d4037] text-sm mt-2">Seleccioná una opción:</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button asChild className="w-full bg-[#d7bba8] text-white hover:bg-[#c6a896]">
                <Link to="/empleados">➕ Empleados</Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button asChild className="w-full bg-[#a1887f] text-white hover:bg-[#8d6e63]">
                <Link to="/asignarTurno">📅 Gestión de turnos</Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1 }}>
              <Button
                disabled
                className="w-full opacity-60 cursor-not-allowed bg-[#d7ccc8] text-[#5d4037]"
              >
                📊 Reportes (próximamente)
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MenuAdmin;