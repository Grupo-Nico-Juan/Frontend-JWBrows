import React, { useEffect, useState } from "react";
import axios from "../api/AxiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
};

interface Usuario {
  tipoUsuario: string;
};

const EmpleadosList: React.FC = () => {
  const { usuario } = useAuth() as { usuario: Usuario | null };
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!usuario || usuario.tipoUsuario !== "Administrador") {
      navigate("/");
      return;
    }
    const fetchEmpleados = async () => {
      try {
        const res = await axios.get<Empleado[]>("/api/Empleado");
        setEmpleados(res.data);
      } catch (err) {
        setError("Error al cargar empleados");
      }
    };
    fetchEmpleados();
  }, [usuario, navigate]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar empleado?")) return;
    try {
      await axios.delete(`/api/Empleado/${id}`);
      setEmpleados(empleados.filter((e) => e.id !== id));
    } catch {
      setError("No se pudo eliminar el empleado");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Empleados</h2>
      <Button className="mb-4" onClick={() => navigate("/empleados/nuevo")}>
        Nuevo Empleado
      </Button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleados.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.nombre}</TableCell>
                <TableCell>{emp.apellido}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.cargo}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/empleados/editar/${emp.id}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmpleadosList;
