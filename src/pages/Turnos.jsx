import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Turnos = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usuario || usuario.tipoUsuario !== "Empleado") {
      navigate("/");
      return;
    }

    const fetchTurnos = async () => {
      try {
        const response = await axios.get("/api/turnos/dia"); // ajustá la URL según tu API
        setTurnos(response.data);
      } catch (err) {
        setError("No se pudieron cargar los turnos.");
        console.error(err);
      }
    };

    fetchTurnos();
  }, [usuario, navigate]);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>Turnos del Día</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {turnos.length === 0 ? (
        <p>No hay turnos asignados para hoy.</p>
      ) : (
        <ul>
          {turnos.map((turno) => (
            <li key={turno.id}>
              {turno.hora} - {turno.clienteNombre} - {turno.servicio}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Turnos;
