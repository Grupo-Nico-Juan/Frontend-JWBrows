import React, { ChangeEvent, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface Extra {
  id: number;
  nombre: string;
  duracionMinutos: number;
  precio: number;
}

const AsignarExtrasServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [extras, setExtras] = useState<Extra[]>([]);
  const [nuevo, setNuevo] = useState<Omit<Extra, "id" | "servicioId">>({
    nombre: "",
    duracionMinutos: 0,
    precio: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const res = await axios.get<Extra[]>(`/api/Servicio/${id}/extras`);
        setExtras(res.data);
      } catch (err) {
        setError("Error al cargar extras");
      }
    };
    fetchExtras();
  }, [id]);

  const borrarExtra = async (extraId: number) => {
    try {
      await axios.delete(`/api/Servicio/extras/${extraId}`);
      setExtras((prev) => prev.filter((e) => e.id !== extraId));
    } catch (err) {
      setError("No se pudo borrar el extra");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevo((n) => ({
      ...n,
      [name]: name === "duracionMinutos" || name === "precio" ? Number(value) : value,
    }));
  };

  const agregarExtra = async () => {
    setError("");
    try {
      await axios.post(`/api/Servicio/${id}/extras`, {
        ...nuevo,
        servicioId: Number(id),
      });
      setNuevo({ nombre: "", duracionMinutos: 0, precio: 0 });
      const res = await axios.get<Extra[]>(`/api/Servicio/${id}/extras`);
      setExtras(res.data);
    } catch (err) {
      setError("No se pudo agregar el extra");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-[#fffaf5] border border-[#e0d6cf] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6e4b3a]">Extras del Servicio</CardTitle>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-2 mb-6">
              <Input
                name="nombre"
                placeholder="Nombre"
                value={nuevo.nombre}
                onChange={handleChange}
              />
              <Input
                name="duracionMinutos"
                type="number"
                placeholder="Duración"
                value={nuevo.duracionMinutos}
                onChange={handleChange}
                min={0}
              />
              <div className="flex gap-2">
                <Input
                  name="precio"
                  type="number"
                  placeholder="Precio"
                  className="flex-1"
                  value={nuevo.precio}
                  onChange={handleChange}
                  min={0}
                />
                <Button onClick={agregarExtra} className="bg-green-600 hover:bg-green-700 text-white">
                  Agregar
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f3e5e1]">
                    <TableHead>Extra</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extras.map((ex) => (
                    <TableRow key={ex.id}>
                      <TableCell>{ex.nombre}</TableCell>
                      <TableCell>{ex.duracionMinutos} min</TableCell>
                      <TableCell>${ex.precio}</TableCell>
                      <TableCell>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            onClick={() => borrarExtra(ex.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Borrar
                          </Button>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ))}
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

export default AsignarExtrasServicio;
