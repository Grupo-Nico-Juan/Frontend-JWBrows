import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTurno } from "@/context/TurnoContext";

const ConfirmarTurnoCliente: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  const { sucursal, detalles, fechaHora, empleado } = useTurno();

  const handleSubmit = async () => {
    if (!nombre || !telefono || !apellido) {
      toast.error("Completa nombre, apellido y teléfono");
      return;
    }

    if (!sucursal || detalles.length === 0 || !fechaHora || !empleado) {
      toast.error("Faltan datos para confirmar el turno");
      return;
    }

    setLoading(true);

    try {
      // 1. Verificar si el cliente ya existe
      let clienteId: number;
      try {
        const res = await axios.get(`/api/Cliente/telefono/${telefono}`);
        clienteId = res.data.id;
      } catch (err: any) {
        if (err.response?.status === 404) {
          const res = await axios.post("/api/Cliente/registrar-sin-cuenta", {
            nombre,
            apellido,
            telefono
          });
          clienteId = res.data.id;
        } else {
          throw err;
        }
      }

      // 2. Preparar el body con solo servicioId
      const body = {
        fechaHora,
        empleadaId: empleado.id,
        clienteId,
        detalles: detalles.map((d) => ({
          turnoId: 0,
          servicioId: d.servicio.id,
        }))
      };

      const payload = {
        servicios: detalles.map((d) => ({
          id: d.servicio.id,
          extras: d.extras.map((e) => ({ id: e.id }))
        }))
      };

      console.log("📤 Body del POST /api/Turnos:", body);

      const fecha = new Date(fechaHora);
      console.log("🕒 Día:", fecha.getDay(), "Hora:", fecha.toTimeString());

      
      // 3. Enviar el turno
      await axios.post("/api/Turnos", body);

      toast.success("Turno agendado con éxito");
      navigate("/");
    } catch (err: any) {
      console.error("Error al agendar el turno:", err.response?.data);
      toast.error("Hubo un error al agendar el turno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1]">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card className="p-4 bg-[#fffaf5] border border-[#e6dcd4] shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-[#6e4b3a]">Tus datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Input
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
            <Input
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-jmbrows w-full"
            >
              Confirmar Turno
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConfirmarTurnoCliente;

