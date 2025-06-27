import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/AxiosInstance";
import { useTurno } from "@/context/TurnoContext";
import ImagenServicio from "@/assets/jmbrows.jpg";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { motion } from "framer-motion";
import { CheckboxCard } from "@/components/ui/checkbox-card";

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
  const [sectorActivo, setSectorActivo] = useState<number | null>(null);
  const navigate = useNavigate();
  const { agregarDetalle, quitarDetalle, sucursal, servicios } = useTurno();

  useEffect(() => {
    if (!sucursal) return;
    axios
      .get(`/api/Sector/sucursal/${sucursal.id}`)
      .then((res) => {
        setSectores(res.data);
        if (res.data.length > 0) setSectorActivo(res.data[0].id);
      })
      .catch((err) => console.error("Error cargando sectores", err))
      .finally(() => setLoading(false));
  }, [sucursal]);

  const toggleServicio = (servicio: Servicio, seleccionado: boolean) => {
    if (seleccionado) {
      quitarDetalle(servicio.id);
    } else {
      agregarDetalle(servicio);
    }
  };

  const totalPrecio = servicios.reduce((sum, s) => sum + s.precio, 0);
  const totalDuracion = servicios.reduce((sum, s) => sum + s.duracionMinutos, 0);
  const sectorActual = sectores.find((s) => s.id === sectorActivo);

  return (
    <div className="flex flex-col justify-between bg-[#fdf6f1] min-h-[100dvh] px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-6xl mx-auto pb-16"
      >
        {/* Navegación de sectores */}
        <NavigationMenu className="mb-6 justify-center">
          <NavigationMenuList>
            {sectores.map((sector) => (
              <NavigationMenuItem key={sector.id}>
                <NavigationMenuLink
                  active={sectorActivo === sector.id}
                  onClick={() => setSectorActivo(sector.id)}
                  className={`cursor-pointer px-4 py-2 rounded-md transition ${
                    sectorActivo === sector.id ? "bg-[#e7ddd3]" : ""
                  }`}
                >
                  {sector.nombre}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Servicios del sector */}
        <Card className="p-6 bg-[#fffaf5] border border-[#e6dcd4] shadow-xl ">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6e4b3a]">
              Servicios de {sectorActual?.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Cargando servicios...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectorActual?.servicios.map((servicio) => {
                  const seleccionado = servicios.some((s) => s.id === servicio.id);
                  return (
                    <CheckboxCard
                      key={servicio.id}
                      label={servicio.nombre}
                      description={`${servicio.duracionMinutos} min - $${servicio.precio}`}
                      checked={seleccionado}
                      onCheckedChange={() => toggleServicio(servicio, seleccionado)}
                      icon={
                        <img
                          src={ImagenServicio}
                          alt={servicio.nombre}
                          className="h-32 w-full object-cover rounded"
                        />
                      }
                    />
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Menú fijo inferior */}
      {servicios.length > 0 && (
        <div className="z-50 fixed bottom-0 left-0 right-0 bg-[#fffaf5] border-t border-[#e6dcd4] px-6 py-4 flex justify-between items-center shadow-lg">
          <span className="text-[#6e4b3a]">
            {servicios.length} servicios seleccionados • {totalDuracion} min • ${totalPrecio}
          </span>
          <Button
            onClick={() => navigate("/reserva/fecha-hora")}
            className="btn-jmbrows"
          >
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeleccionServicio;