import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    // Cargar empleadas
    axios.get<Empleada[]>("/api/empleados")
      .then(res => setEmpleadas(res.data))
      .catch(err => console.error(err));

    // Cargar servicios (mock si no tenés endpoint real)
    axios.get<Servicio[]>("/api/servicios")
      .then(res => setServicios(res.data))
      .catch(() => {
        setServicios([
          { id: 1, nombre: "Corte de pelo", duracionMinutos: 30, precio: 500 },
          { id: 2, nombre: "Peinado", duracionMinutos: 45, precio: 800 },
        ]);
      });
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
      await axios.post("/api/turnos", formData);
      alert("Turno asignado correctamente");
      navigate("/menu-admin");
    } catch (err) {
      console.error(err);
      alert("Error al asignar turno");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Asignar Turno</h2>
      <form onSubmit={handleSubmit}>
        <label>Fecha y Hora:</label>
        <input
          type="datetime-local"
          value={formData.fechaHora}
          onChange={e => setFormData({ ...formData, fechaHora: e.target.value })}
          required
        />

        <label>Empleado:</label>
        <select
          value={formData.empleadaId}
          onChange={e => setFormData({ ...formData, empleadaId: e.target.value })}
          required
        >
          <option value="">Seleccione un empleado</option>
          {empleadas.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.nombre} {emp.apellido}</option>
          ))}
        </select>

        <hr />
        <h4>Agregar Servicios al Turno</h4>
        <label>Servicio:</label>
        <select
          value={detalleActual.servicioId || ""}
          onChange={e => setDetalleActual({
            ...detalleActual,
            servicioId: parseInt(e.target.value) || 0
          })}
          required
        >
          <option value="">Seleccione</option>
          {servicios.map(serv => (
            <option key={serv.id} value={serv.id}>{serv.nombre}</option>
          ))}
        </select>

        <label>Duración (min):</label>
        <input
          type="number"
          value={detalleActual.duracionMinutos}
          onChange={e => setDetalleActual({
            ...detalleActual,
            duracionMinutos: parseInt(e.target.value) || 0
          })}
        />

        <label>Precio ($):</label>
        <input
          type="number"
          value={detalleActual.precio}
          onChange={e => setDetalleActual({
            ...detalleActual,
            precio: parseFloat(e.target.value) || 0
          })}
        />

        <Button onClick={handleAgregarDetalle}>Agregar Servicio</Button>
        <ul>
          {formData.detalles.map((d, i) => (
            <li key={i}>Servicio ID: {d.servicioId}, Duración: {d.duracionMinutos} min, Precio: ${d.precio}</li>
          ))}
        </ul>

        <Button>Asignar Turno</Button>
      </form>
    </div>
  );
};

export default AsignarTurno;
