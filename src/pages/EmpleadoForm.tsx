import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from '../api/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type EmpleadoFormData = {
  nombre: string;
  apellido: string;
  email: string;
  passwordPlano: string;
  cargo: string;
};

const EmpleadoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editando = !!id;

  const [form, setForm] = useState<EmpleadoFormData>({
    nombre: '',
    apellido: '',
    email: '',
    passwordPlano: '',
    cargo: ''
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editando && id) {
      axios.get<EmpleadoFormData>(`/api/Empleado/${id}`)
        .then(res => setForm({ ...res.data, passwordPlano: '' }))
        .catch(() => setError('No se pudo cargar el empleado'));
    }
  }, [editando, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      if (editando && id) {
        // PUT para editar (no se envía passwordPlano si está vacío)
        const { passwordPlano, ...rest } = form;
        await axios.put(`/api/Empleado/${id}`, passwordPlano ? form : rest);
      } else {
        // POST para crear
        await axios.post('/api/Empleado', form);
      }
      navigate('/empleados');
    } catch (err) {
      setError('Error al guardar empleado');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>{editando ? 'Editar' : 'Nuevo'} Empleado</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={editando}
        />
        <input
          name="passwordPlano"
          type="password"
          placeholder={editando ? "Nueva contraseña (opcional)" : "Contraseña"}
          value={form.passwordPlano}
          onChange={handleChange}
          required={!editando}
        />
        <input
          name="cargo"
          placeholder="Cargo"
          value={form.cargo}
          onChange={handleChange}
          required
        />
        <Button type="submit">{editando ? 'Guardar cambios' : 'Crear empleado'}</Button>
        <Button type="button" onClick={() => navigate('/empleados')}>Cancelar</Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default EmpleadoForm;
