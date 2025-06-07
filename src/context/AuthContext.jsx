import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [usuario, setUsuario] = useState(null); // Podés guardar más info acá si el backend la devuelve

  // Para mantener la sesión viva al recargar
  useEffect(() => {
    if (token && !usuario) {
      try {//arreglar porque el payload carga undefined el correo y el tipo 
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsuario({ correo: payload.email,
                    tipoUsuario: payload.tipoUsuario });
                     // adaptar según tu token
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
    setUsuario({ correo: payload.email
      
     }); // o el campo que tenga tu token
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
