import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/AxiosInstance';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from "lucide-react";
import { motion } from 'framer-motion';

type AuthContextType = {
  login: (token: string) => void;
};

interface FormData {
  email: string;
  password: string;
}

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
        const payload = JSON.parse(atob(token.split('.')[1]));
        const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const tipoUsuario = payload[ROLE_CLAIM] || payload.role;

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
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-[#fffaf5] shadow-lg border border-[#d4bfae] rounded-xl relative">
          {/* Logo en la esquina superior derecha 
        <div className="absolute top-4 right-4">
          <img
            src="/logo.png" // reemplazá esto con la ruta real cuando tengas el logo
            alt="Logo del local"
            className="h-10 w-auto object-contain"
          />
        </div>
        */
          }
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#7a5b4c] text-center">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-[#fdf6f1] text-[#7a5b4c] border border-[#e1cfc0] focus:border-[#a37e63] focus:ring-0"
              />

              <Input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-[#fdf6f1] text-[#7a5b4c] border border-[#e1cfc0] focus:border-[#a37e63] focus:ring-0"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className="w-full bg-[#a37e63] hover:bg-[#8b6652] text-white font-medium py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <LogIn size={18} className="stroke-white" />
                <span>Ingresar</span>
              </motion.button>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;