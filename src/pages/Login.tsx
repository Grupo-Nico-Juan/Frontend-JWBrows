import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/AxiosInstance';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AuthContextType = {
  login: (token: string) => void;
};

type FormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth() as AuthContextType;

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('api/Usuario/login', formData);
      const token: string = response.data.token;

      if (token) {
        login(token);

        // decodificar el token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const tipoUsuario = payload[ROLE_CLAIM] || payload.role;

        // redirección según tipo
        if (tipoUsuario === "Administrador") {
          navigate("/menu-admin");
        } else if (tipoUsuario === "Empleado") {
          navigate("/turnos");
        } else {
          setError("Tipo de usuario no válido.");
        }

      } else {
        setError('Token no recibido. Verifica la respuesta del servidor.');
      }
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas o error de servidor.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <Button type="submit" className="w-full mt-4">
          Ingresar
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
