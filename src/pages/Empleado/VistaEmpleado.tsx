import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@/api/AxiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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

interface Turno {
  id: number;
  clienteNombre: string;
  fechaHora: string;
  servicios: Servicio[];
}

const VistaEmpleado = () => {
  const { empleadaId } = useParams<{ empleadaId: string }>();
  const [empleadas, setEmpleadas] = useState<Empleada[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [empleadaSeleccionada, setEmpleadaSeleccionada] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (empleadaId) {
      const id = parseInt(empleadaId);
      setEmpleadaSeleccionada(id);
    }
  }, [empleadaId]);

  useEffect(() => {
    if (!empleadaSeleccionada) return;

    axios
      .get(`/api/Empleado/sector/${empleadaSeleccionada}`) // ya la estás usando en la otra vista
      .then((res) => setEmpleadas(res.data))
      .catch(console.error);

    axios
      .get(`/api/Turnos/empleada/${empleadaSeleccionada}/hoy`)
      .then((res) => setTurnos(res.data))
      .catch(console.error);
  }, [empleadaSeleccionada]);

  const handleChangeEmpleada = (id: string) => {
    navigate(`/vista-empleado/${id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Select onValueChange={handleChangeEmpleada} value={empleadaSeleccionada?.toString()}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar empleada" />
          </SelectTrigger>
          <SelectContent>
            {empleadas.map((e) => (
              <SelectItem key={e.id} value={e.id.toString()}>
                {e.nombre} {e.apellido}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[75dvh] pr-2">
        {turnos.length === 0 ? (
          <p>No hay turnos asignados para hoy.</p>
        ) : (
          turnos.map((turno) => (
            <Card key={turno.id} className="mb-4">
              <CardHeader>
                <CardTitle className="text-[#6e4b3a]">
                  {new Date(turno.fechaHora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {turno.clienteNombre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-700">
                  {turno.servicios.map((s) => (
                    <li key={s.id}>• {s.nombre}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default VistaEmpleado;