import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@/api/AxiosInstance";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";

interface Sector {
  id: number;
  nombre: string;
  descripcion: string;
  sucursalId: number;
}

const AsignarSectoresServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [sectoresAsignados, setSectoresAsignados] = useState<number[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTodos, resAsignados] = await Promise.all([
          axios.get<Sector[]>("/api/Sector"),
          axios.get<Sector[]>(`/api/Servicio/${id}/sectores`),
        ]);
        setSectores(resTodos.data);
        setSectoresAsignados(resAsignados.data.map(s => s.id));
      } catch (err) {
        setError("Error al cargar sectores");
      }
    };
    fetchData();
  }, [id]);

  const toggleSector = async (sectorId: number) => {
    const asignado = sectoresAsignados.includes(sectorId);
    try {
      if (asignado) {
        await axios.delete(`/api/Servicio/${id}/sectores/${sectorId}`);
        setSectoresAsignados(prev => prev.filter(s => s !== sectorId));
      } else {
        await axios.post(`/api/Servicio/${id}/sectores/${sectorId}`);
        setSectoresAsignados(prev => [...prev, sectorId]);
      }
    } catch (err) {
      setError("No se pudo actualizar el sector");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1] px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-4xl">
        <Card className="bg-[#fffaf5] border border-[#e0d6cf] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6e4b3a]">Asignar Sectores al Servicio</CardTitle>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f3e5e1]">
                    <TableHead>Sector</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Asignado</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectores.map((sector) => {
                    const asignado = sectoresAsignados.includes(sector.id);
                    return (
                      <TableRow key={sector.id}>
                        <TableCell>{sector.nombre}</TableCell>
                        <TableCell>{sector.descripcion}</TableCell>
                        <TableCell>{asignado ? "Sí" : "No"}</TableCell>
                        <TableCell>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              onClick={() => toggleSector(sector.id)}
                              className={asignado ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                            >
                              {asignado ? "Quitar" : "Asignar"}
                            </Button>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button onClick={() => navigate("/servicios")} className="bg-[#6d4c41] text-white hover:bg-[#5d4037]">
                Volver a lista
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AsignarSectoresServicio;
