import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AsignarTurno = () => {
  const navigate = useNavigate();

  const [empleadas, setEmpleadas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [formData, setFormData] = useState({
    fechaHora: "",
    empleadaId: "",
    detalles: []
  });

  const [detalleActual, setDetalleActual] = useState({
    servicioId: "",
    duracionMinutos: 0,
    precio: 0
  });

  useEffect(() => {
    // Cargar empleadas
    axios.get("/api/empleados").then(res => setEmpleadas(res.data)).catch(err => console.error(err));

    // Cargar servicios (mock si no tenés endpoint real)
    axios.get("/api/servicios").then(res => setServicios(res.data)).catch(() => {
      setServicios([
        { id: 1, nombre: "Corte de pelo", duracionMinutos: 30, precio: 500 },
        { id: 2, nombre: "Peinado", duracionMinutos: 45, precio: 800 },
      ]);
    });
  }, []);

  const handleAgregarDetalle = () => {
    setFormData(prev => ({
      ...prev,
      detalles: [...prev.detalles, detalleActual]
    }));
    setDetalleActual({ servicioId: "", duracionMinutos: 0, precio: 0 });
  };

  const handleSubmit = async (e) => {
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
        <input type="datetime-local" value={formData.fechaHora} onChange={e => setFormData({ ...formData, fechaHora: e.target.value })} required />

        <label>Empleado:</label>
        <select value={formData.empleadaId} onChange={e => setFormData({ ...formData, empleadaId: e.target.value })} required>
          <option value="">Seleccione un empleado</option>
          {empleadas.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.nombre} {emp.apellido}</option>
          ))}
        </select>

        <hr />
        <h4>Agregar Servicios al Turno</h4>
        <label>Servicio:</label>
        <select value={detalleActual.servicioId} onChange={e => setDetalleActual({ ...detalleActual, servicioId: parseInt(e.target.value) })} required>
          <option value="">Seleccione</option>
          {servicios.map(serv => (
            <option key={serv.id} value={serv.id}>{serv.nombre}</option>
          ))}
        </select>

        <label>Duración (min):</label>
        <input type="number" value={detalleActual.duracionMinutos} onChange={e => setDetalleActual({ ...detalleActual, duracionMinutos: parseInt(e.target.value) })} />

        <label>Precio ($):</label>
        <input type="number" value={detalleActual.precio} onChange={e => setDetalleActual({ ...detalleActual, precio: parseFloat(e.target.value) })} />

        <button type="button" onClick={handleAgregarDetalle}>Agregar Servicio</button>

        <ul>
          {formData.detalles.map((d, i) => (
            <li key={i}>Servicio ID: {d.servicioId}, Duración: {d.duracionMinutos} min, Precio: ${d.precio}</li>
          ))}
        </ul>

        <button type="submit">Asignar Turno</button>
      </form>
    </div>
  );
};

export default AsignarTurno;
