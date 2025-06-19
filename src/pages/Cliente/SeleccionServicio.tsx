import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "@/api/AxiosInstance";
import { motion } from "framer-motion";
import { useTurno } from "@/context/TurnoContext";

interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  duracionMinutos: number;
  precio: number;
}

interface Sector {
  id: number;
  nombre: string;
  descripcion?: string;
  sucursalId: number;
  servicios: Servicio[];
}

const SeleccionServicio: React.FC = () => {
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { agregarDetalle, sucursal } = useTurno(); // 👈 Incluye sucursal seleccionada

  useEffect(() => {
    if (!sucursal) return;
    axios.get(`/api/Sector/sucursal/${sucursal.id}`)
      .then(res => setSectores(res.data))
      .catch(err => console.error("Error cargando sectores", err))
      .finally(() => setLoading(false));
      console.log(sectores);
  }, [sucursal]);

  const handleSeleccion = (servicio: Servicio) => {
    agregarDetalle(servicio);
    navigate("/reserva/fecha-hora");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6f1] px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl"
      >
        <Card className="p-6 bg-[#fffaf5] border border-[#e6dcd4] shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6e4b3a]">Elegí un servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <p>Cargando servicios...</p>
            ) : (
              sectores.map(sector => (
                <div key={sector.id}>
                  <h3 className="text-xl font-semibold text-[#6e4b3a] mb-2">{sector.nombre}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sector.servicios.map(servicio => (
                      <motion.div
                        key={servicio.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Card
                          onClick={() => handleSeleccion(servicio)}
                          className="cursor-pointer hover:shadow-lg transition"
                        >
                          <img
                            //src={/imagenes/servicios / ${servicio.id % 5 + 1}.jpg}
                          alt={servicio.nombre}
                          className="h-40 w-full object-cover rounded-t"
/>
                          <CardContent className="p-4">
                            <h4 className="font-bold text-[#6e4b3a]">{servicio.nombre}</h4>
                            <p className="text-sm text-muted-foreground">{servicio.duracionMinutos} min - ${servicio.precio}</p>
                            {servicio.descripcion && <p className="text-xs mt-1 text-gray-500">{servicio.descripcion}</p>}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SeleccionServicio;