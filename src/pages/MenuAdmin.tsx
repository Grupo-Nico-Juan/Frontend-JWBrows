import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const MenuAdmin: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto my-12 p-8 rounded-xl bg-[#fdf6f1] shadow-lg border border-[#e0d6cf]">
      <h2 className="text-3xl font-bold mb-4 text-[#6d4c41]">Menú Administrador</h2>
      <p className="mb-6 text-[#5d4037]">Seleccioná una opción:</p>
      <div className="flex flex-col gap-4">
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
          <Button
            asChild
            className="w-full bg-[#a1887f] text-white hover:bg-[#8d6e63]"
          >
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
      </div>
    </div>
  );
};

export default MenuAdmin;