import React, { useEffect, useState } from "react";
import axios from "../api/AxiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Usuario {
  tipoUsuario: string;
  // puedes agregar más campos si los necesitas
};

interface Turno {
  id: number;
  hora: string;
  clienteNombre: string;
  servicio: string;
  // agrega más campos si tu API los retorna
};

const Turnos: React.FC = () => {
  const { usuario } = useAuth() as { usuario: Usuario | null };
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!usuario || usuario.tipoUsuario !== "Empleado") {
      navigate("/");
      return;
    }

    const fetchTurnos = async () => {
      try {
        const response = await axios.get<Turno[]>("/api/turnos/dia"); // ajustá la URL según tu API
        setTurnos(response.data);
      } catch (err) {
        setError("No se pudieron cargar los turnos.");
        console.error(err);
      }
    };

    fetchTurnos();
  }, [usuario, navigate]);

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Turnos del Día</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {turnos.length === 0 ? (
        <p>No hay turnos asignados para hoy.</p>
      ) : (
        <ul className="space-y-2">
          {turnos.map((turno) => (
            <li
              key={turno.id}
              className="flex items-center justify-between p-4 border rounded"
            >
              <span>
                <span className="font-semibold">{turno.hora}</span> -{" "}
                {turno.clienteNombre} - {turno.servicio}
              </span>
              {/* Ejemplo de botón para acción futura */}
              <Button size="sm" variant="secondary" disabled>
                Detalles
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Turnos;
