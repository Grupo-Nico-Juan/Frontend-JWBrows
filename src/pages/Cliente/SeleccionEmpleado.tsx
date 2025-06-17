import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axios from "@/api/AxiosInstance";
import { useTurno } from "@/context/TurnoContext";

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

const SeleccionEmpleado: React.FC = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);

  const { sucursal, detalles, fechaHora, setEmpleado } = useTurno(); // usamos detalles ahora

  useEffect(() => {
    if (!sucursal || detalles.length === 0 || !fechaHora) {
      navigate("/"); // Validación
      return;
    }

    // Tomamos el primer servicioId de los detalles
    const servicioId = detalles[0].servicio.id;

    axios
      .get(`/api/Empleado`, {
        params: {
          sucursalId: sucursal.id,
          servicioId,
          fechaHora,
        },
      })
      .then((res) => setEmpleados(res.data))
      .catch((err) => console.error("Error cargando empleados", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSeleccion = (emp: Empleado) => {
    setEmpleado(emp); // Guardar en contexto
    navigate("/reserva/confirmar");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1]">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-4 bg-[#fffaf5] border border-[#e6dcd4] shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6e4b3a]">Seleccioná un profesional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p>Cargando empleados...</p>
            ) : empleados.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay empleados disponibles en ese horario.
              </p>
            ) : (
              empleados.map((emp) => (
                <motion.div
                  key={emp.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="btn-jmbrows w-full justify-start"
                    onClick={() => handleSeleccion(emp)}
                  >
                    {emp.nombre} {emp.apellido}
                  </Button>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SeleccionEmpleado;

