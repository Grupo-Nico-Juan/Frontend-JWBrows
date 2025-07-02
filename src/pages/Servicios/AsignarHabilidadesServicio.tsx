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

interface Habilidad {
  id: number;
  nombre: string;
  descripcion: string;
}

const AsignarHabilidadesServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [habilidadesAsignadas, setHabilidadesAsignadas] = useState<number[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todas, asignadas] = await Promise.all([
          axios.get<Habilidad[]>("/api/Habilidad"),
          axios.get<Habilidad[]>(`/api/Servicio/${id}/habilidades`),
        ]);
        setHabilidades(todas.data);
        setHabilidadesAsignadas(asignadas.data.map((h) => h.id));
      } catch (err) {
        setError("Error al cargar habilidades");
      }
    };
    fetchData();
  }, [id]);

  const toggleHabilidad = async (habilidadId: number) => {
    const yaAsignada = habilidadesAsignadas.includes(habilidadId);
    try {
      if (yaAsignada) {
        await axios.delete(`/api/Servicio/${id}/habilidades/${habilidadId}`);
        setHabilidadesAsignadas((prev) => prev.filter((hid) => hid !== habilidadId));
      } else {
        await axios.post(`/api/Servicio/${id}/habilidades/${habilidadId}`);
        setHabilidadesAsignadas((prev) => [...prev, habilidadId]);
      }
    } catch (err) {
      setError("No se pudo actualizar la habilidad");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1] px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-4xl">
        <Card className="bg-[#fffaf5] border border-[#e0d6cf] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6e4b3a]">Asignar Habilidades al Servicio</CardTitle>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f3e5e1]">
                    <TableHead>Habilidad</TableHead>
                    <TableHead>Asignada</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {habilidades.map((hab) => {
                    const asignada = habilidadesAsignadas.includes(hab.id);
                    return (
                      <TableRow key={hab.id}>
                        <TableCell>{hab.nombre}</TableCell>
                        <TableCell>{asignada ? "Sí" : "No"}</TableCell>
                        <TableCell>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              onClick={() => toggleHabilidad(hab.id)}
                              className={asignada ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                            >
                              {asignada ? "Quitar" : "Asignar"}
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

export default AsignarHabilidadesServicio;
