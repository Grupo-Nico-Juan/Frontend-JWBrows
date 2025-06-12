import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [usuario, setUsuario] = useState(null); // Podés guardar más info acá si el backend la devuelve
  const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

  // Para mantener la sesión viva al recargar
  useEffect(() => {
    if (token && !usuario) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsuario({
          correo: payload.email,
          tipoUsuario: payload[ROLE_CLAIM] || payload.role // Intenta ambos por compatibilidad
        });
      } catch (e) {
        console.error("Token inválido", e);
        logout();
      }
    }
  }, [token]);

  const login = (nuevoToken) => {
    localStorage.setItem('token', nuevoToken);
    setToken(nuevoToken);
    const payload = JSON.parse(atob(nuevoToken.split('.')[1]));
    setUsuario({
      correo: payload.email,
      tipoUsuario: payload[ROLE_CLAIM] || payload.role
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, estaAutenticado: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder fácilmente desde otros componentes
export const useAuth = () => useContext(AuthContext);
