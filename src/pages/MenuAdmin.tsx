import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const MenuAdmin: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 bg-[#fffaf5] border border-[#e1cfc3] rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-[#7a5b4c]">Menú Administrador</h2>
        <p className="mb-6 text-[#7a5b4c]">Seleccioná una opción:</p>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full bg-[#a37e63] hover:bg-[#8b6652] text-white transition-colors" >
            <Link to="/empleados">➕ Empleados</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-[#e1cfc3] text-[#7a5b4c] hover:bg-[#f4e9e1]"
          >
            <Link to="/asignarTurno">📅 Gestión de turnos</Link>
          </Button>

          <Button
            disabled
            className="w-full bg-[#e3dbd4] text-[#8c837b] cursor-not-allowed"
          >
            📊 Reportes (próximamente)
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default MenuAdmin;