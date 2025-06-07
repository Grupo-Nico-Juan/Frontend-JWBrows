import React from "react";
import { Link } from "react-router-dom";

const MenuAdmin = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Menú Administrador</h2>
      <p>Seleccioná una opción:</p>

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        <li>
          <Link to="/empleados">➕ Empleados</Link>
        </li>
        <li>
          <Link to="/turnos">📅 Gestión de turnos</Link>
        </li>
        <li>
          <span style={{ color: "#aaa" }}>📊 Reportes (próximamente)</span>
        </li>
      </ul>
    </div>
  );
};

export default MenuAdmin;