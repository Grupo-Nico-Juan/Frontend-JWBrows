import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const [correoElectronico, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/usuario/registro', {
        correoElectronico,
        clave,
        nombre
      });
      alert('Registro exitoso');
      navigate('/'); // Redirige al login
    } catch (err) {
      setError('Error en el registro. Verificá los datos.');
    }
  };

  return (
    <form onSubmit={handleRegistro}>
      <h2>Registrarse</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo"
        value={correoElectronico}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Clave"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
        required
      />
      <button type="submit">Registrarse</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Registro;