import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "@/api/AxiosInstance";
import { motion } from "framer-motion";
import { useTurno } from "@/context/TurnoContext"; 

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

const SeleccionSucursal: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setSucursal, resetTurno } = useTurno(); // 👈 Usar el contexto

  useEffect(() => {
    resetTurno(); // 👈 Limpiar datos anteriores si los hubiera
    axios.get("/api/Sucursal")
      .then(res => setSucursales(res.data))
      .catch(err => console.error("Error cargando sucursales", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSeleccion = (sucursal: Sucursal) => {
    setSucursal(sucursal); // 👈 Guardar en contexto
    navigate("/reserva/servicio");
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
            <CardTitle className="text-2xl text-[#6e4b3a]">Seleccioná una sucursal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              sucursales.map((sucursal) => (
                <motion.div
                  key={sucursal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="btn-jmbrows w-full justify-start"
                    onClick={() => handleSeleccion(sucursal)}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{sucursal.nombre}</div>
                      <div className="text-sm text-muted-foreground">{sucursal.direccion}</div>
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

export default SeleccionSucursal;
