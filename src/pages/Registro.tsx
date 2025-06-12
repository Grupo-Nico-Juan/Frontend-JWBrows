import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormData = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  tipoUsuario: string;
};

const Registro: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    tipoUsuario: "Empleado",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/Usuario/Registrar", formData);
      navigate("/login");
    } catch (err) {
      setError("Error al registrar usuario. Verifica los datos.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="tipoUsuario"
          value={formData.tipoUsuario}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="Empleado">Empleado</option>
          <option value="Administrador">Administrador</option>
        </select>
        <Button type="submit" className="w-full mt-4">
          Registrarse
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Registro;
