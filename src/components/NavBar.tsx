import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

const NavBar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // vuelve al login
  };

  if (!usuario) return null;

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", marginBottom: "2rem" }}>
      {usuario.tipoUsuario === "Administrador" ? (
        <>
          <Link to="/menu-admin">Inicio</Link> {" | "}
          <Link to="/empleados/nuevo">Alta Usuario</Link> {" | "}
          <Link to="/asignarTurno">Gestión de Turnos</Link> {" | "}
        </>
      ) : null}
      <Button onClick={handleLogout}>Cerrar sesión</Button>
    </nav>
  );
};

export default NavBar;