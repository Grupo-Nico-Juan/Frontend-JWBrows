import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

interface Empleada {
  id: number;
  nombre: string;
  apellido: string;
}

interface Servicio {
  id: number;
  nombre: string;
  duracionMinutos: number;
  precio: number;
}

interface DetalleTurno {
  servicioId: number;
  duracionMinutos: number;
  precio: number;
}

interface FormData {
  fechaHora: string;
  empleadaId: string;
  detalles: DetalleTurno[];
}

const AsignarTurno: React.FC = () => {
  const navigate = useNavigate();
  const [empleadas, setEmpleadas] = useState<Empleada[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [formData, setFormData] = useState<FormData>({
    fechaHora: "",
    empleadaId: "",
    detalles: []
  });
  const [detalleActual, setDetalleActual] = useState<DetalleTurno>({
    servicioId: 0,
    duracionMinutos: 0,
    precio: 0
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("10:30:00");

  useEffect(() => {
    axios.get<Empleada[]>("/api/Empleado")
      .then(res => setEmpleadas(res.data))
      .catch(err => console.error(err));

    axios.get<Servicio[]>("/api/Servicio")
      .then(res => setServicios(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAgregarDetalle = () => {
    if (!detalleActual.servicioId) return;
    setFormData(prev => ({
      ...prev,
      detalles: [...prev.detalles, detalleActual]
    }));
    setDetalleActual({ servicioId: 0, duracionMinutos: 0, precio: 0 });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const fechaHoraStr = date ? `${date.toISOString().split("T")[0]}T${time}` : "";
      await axios.post("/api/turnos", {
        ...formData,
        fechaHora: fechaHoraStr
      });
      toast.success("Turno asignado correctamente");
      navigate("/menu-admin");
    } catch (err) {
      console.error(err);
      toast.error("Error al asignar turno");
    }
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
            <CardTitle className="text-2xl text-[#6e4b3a]">Asignar Turno</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <label className="text-sm px-1">Fecha</label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                      >
                        {date ? date.toLocaleDateString() : "Seleccionar fecha"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date);
                          setCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm px-1">Hora</label>
                  <Input
                    type="time"
                    step="1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>

              <label className="text-sm px-1">Empleado:</label>
              <select
                value={formData.empleadaId}
                onChange={e => setFormData({ ...formData, empleadaId: e.target.value })}
                required
                className="border rounded-md px-2 py-2 w-full"
              >
                <option value="">Seleccione un empleado</option>
                {empleadas.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre} {emp.apellido}
                  </option>
                ))}
              </select>
              <hr className="my-2 border-muted" />
              <h4 className="text-lg text-[#6e4b3a] font-semibold">Agregar servicios</h4>

              <div className="grid grid-cols-3 gap-4">
                <label className="flex flex-col text-sm col-span-1">
                  Servicio:
                  <select
                    value={detalleActual.servicioId || ""}
                    onChange={e => setDetalleActual({
                      ...detalleActual,
                      servicioId: parseInt(e.target.value) || 0
                    })}
                    required
                    className="border rounded-md px-2 py-2"
                  >
                    <option value="">Seleccione</option>
                    {servicios.map(serv => (
                      <option key={serv.id} value={serv.id}>{serv.nombre}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col text-sm">
                  Duración (min):
                  <Input
                    type="number"
                    value={detalleActual.duracionMinutos}
                    onChange={e => setDetalleActual({
                      ...detalleActual,
                      duracionMinutos: parseInt(e.target.value) || 0
                    })}
                  />
                </label>

                <label className="flex flex-col text-sm">
                  Precio ($):
                  <Input
                    type="number"
                    value={detalleActual.precio}
                    onChange={e => setDetalleActual({
                      ...detalleActual,
                      precio: parseFloat(e.target.value) || 0
                    })}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button type="button" onClick={handleAgregarDetalle} className="btn-jmbrows w-40" >
                    Agregar Servicio
                  </Button>
                </motion.div>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button type="submit" className="btn-jmbrows w-40"  >
                    Asignar Turno </Button>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AsignarTurno;
