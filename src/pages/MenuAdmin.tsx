import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MenuAdmin: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto my-12 p-8 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Menú Administrador</h2>
      <p className="mb-6">Seleccioná una opción:</p>
      <div className="flex flex-col gap-4">
        <Button asChild className="w-full">
          <Link to="/empleados">➕ Empleados</Link>
        </Button>
        <Button asChild className="w-full" variant="secondary">
          <Link to="/asignarTurno">📅 Gestión de turnos</Link>
        </Button>
        <Button disabled className="w-full opacity-60 cursor-not-allowed">
          📊 Reportes (próximamente)
        </Button>
      </div>
    </div>
  );
};

export default MenuAdmin;