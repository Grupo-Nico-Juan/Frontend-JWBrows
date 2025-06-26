import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axios from "@/api/AxiosInstance";
import { useTurno } from "@/context/TurnoContext";

interface EmpleadaDisponible {
  id: number;
  nombreCompleto: string;
  serviciosQuePuedeRealizar: number[];
}

const SeleccionEmpleado: React.FC = () => {
  const navigate = useNavigate();
  const [empleadas, setEmpleadas] = useState<EmpleadaDisponible[]>([]);
  const [loading, setLoading] = useState(true);

  const { detalles, fechaHora, setEmpleado } = useTurno();

  useEffect(() => {
    if (!fechaHora || detalles.length === 0) {
      navigate("/");
      return;
    }

    const serviciosSeleccionados = detalles.map(d => d.servicio.id);

    axios.post<EmpleadaDisponible[]>("/api/Empleado/disponibles", {
      fechaHoraInicio: fechaHora,
      serviciosSeleccionados,
    })
    .then((res) => setEmpleadas(res.data))
    .catch((err) => console.error("Error cargando empleadas disponibles", err))
    .finally(() => setLoading(false));
  }, []);

  const handleSeleccion = (emp: EmpleadaDisponible) => {
    setEmpleado({
      id: emp.id,
      nombre: emp.nombreCompleto.split(" ")[0],
      apellido: emp.nombreCompleto.split(" ").slice(1).join(" "),
    });
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
              <p>Cargando empleadas...</p>
            ) : empleadas.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay empleadas disponibles en ese horario.
              </p>
            ) : (
              empleadas.map((emp) => (
                <motion.div
                  key={emp.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="btn-jmbrows w-full justify-start"
                    onClick={() => handleSeleccion(emp)}
                  >
                    {emp.nombreCompleto}
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
