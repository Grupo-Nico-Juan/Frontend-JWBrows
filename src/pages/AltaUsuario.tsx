import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/AxiosInstance";
import { Button } from "@/components/ui/button";

interface Usuario {
  tipoUsuario: string;
  // puedes agregar más campos si los necesitas
};

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  tipoUsuario: string;
};

const AltaUsuario: React.FC = () => {
  const { usuario, token } = useAuth() as { usuario: Usuario | null; token: string | null };
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    tipoUsuario: "Empleado",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (!token || !usuario || usuario.tipoUsuario !== "Administrador") {
      navigate("/"); // Redirige si no tiene permisos
    }
  }, [token, usuario, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/Usuario/Registrar", formData);
      setSuccess("Usuario registrado correctamente.");
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        tipoUsuario: "Empleado",
      });
    } catch (err) {
      setError("Error al registrar usuario.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h2>Alta de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
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
        >
          <option value="Empleado">Empleado</option>
          <option value="Administrador">Administrador</option>
          {/* Futuro: <option value="Cliente">Cliente</option> */}
        </select>
        <Button type="submit">Registrar</Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default AltaUsuario;
