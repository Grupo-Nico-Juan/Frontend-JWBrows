import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ConfirmarTurnoCliente: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  const sucursal = JSON.parse(localStorage.getItem("sucursalSeleccionada") || "{}");
  const servicio = JSON.parse(localStorage.getItem("servicioSeleccionado") || "{}");
  const fecha = localStorage.getItem("fechaSeleccionada") || "";
  const hora = localStorage.getItem("horaSeleccionada") || "";
  const empleado = JSON.parse(localStorage.getItem("empleadoSeleccionado") || "{}");

  const handleSubmit = () => {
    if (!nombre || !telefono || !apellido) {
      toast.error("Completa nombre, apellido y teléfono");
      return;
    }

    setLoading(true);
    let clienteId: number | null = null;

    axios
      .get(`/api/Cliente/telefono/${telefono}`)
      .then((res) => {
        clienteId = res.data.id;
        return Promise.resolve(); // continuar
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          // Cliente no existe, lo creamos
          return axios.post("/api/Cliente", {
            nombre,
            telefono,
            apellido
          }).then((res) => {
            clienteId = res.data.id;
          });
        } else {
          throw err;
        }
      })
      .then(() => {
        const fechaHora = `${fecha}T${hora}`;
        return axios.post("/api/Turnos", {
          fechaHora,
          empleadaId: empleado.id,
          clienteId,
          detalles: [
            {
              servicioId: servicio.id,
              duracionMinutos: servicio.duracionMinutos,
              precio: servicio.precio,
            },
          ],
        });
      })
      .then(() => {
        toast.success("Turno agendado con éxito");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Hubo un error al agendar el turno");
      })
      .then(() => {
        setLoading(false);
      });
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