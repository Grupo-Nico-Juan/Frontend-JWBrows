import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "@/api/AxiosInstance";
import { motion } from "framer-motion";
import { useTurno } from "@/context/TurnoContext"; // 👈

interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  duracionMinutos: number;
  precio: number;
}

const SeleccionServicio: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { agregarDetalle } = useTurno(); // 👈 Usamos el nuevo método

  useEffect(() => {
    axios.get("/api/Servicio")
      .then(res => setServicios(res.data))
      .catch(err => console.error("Error cargando servicios", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSeleccion = (servicio: Servicio) => {
    agregarDetalle(servicio); // 👈 Agrega como detalle
    navigate("/reserva/fecha-hora");
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
            <CardTitle className="text-2xl text-[#6e4b3a]">Seleccioná un servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              servicios.map((servicio) => (
                <motion.div
                  key={servicio.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="btn-jmbrows w-full justify-start"
                    onClick={() => handleSeleccion(servicio)}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{servicio.nombre}</div>
                      <div className="text-sm text-muted-foreground">
                        {servicio.duracionMinutos} min - ${servicio.precio}
                      </div>
                    </div>
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

export default SeleccionServicio;

