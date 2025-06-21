import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipos
interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  duracionMinutos: number;
  precio: number;
}

interface DetalleTurno {
  servicio: Servicio;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

interface ClienteData {
  nombre: string;
  apellido: string;
  telefono: string;
}

interface TurnoContextType {
  sucursal: Sucursal | null;
  setSucursal: (s: Sucursal) => void;

  detalles: DetalleTurno[];
  agregarDetalle: (servicio: Servicio) => void;
  quitarDetalle: (servicioId: number) => void;
  servicios: Servicio[]; // derivado
  agregarDetalles: (servicios: Servicio[]) => void; 

  fechaHora: string;
  setFechaHora: (f: string) => void;

  empleado: Empleado | null;
  setEmpleado: (e: Empleado) => void;

  cliente: ClienteData | null;
  setCliente: (c: ClienteData) => void;

  resetTurno: () => void;
}

// Contexto
const TurnoContext = createContext<TurnoContextType | undefined>(undefined);

export const TurnoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sucursal, setSucursal] = useState<Sucursal | null>(null);
  const [detalles, setDetalles] = useState<DetalleTurno[]>([]);
  const [fechaHora, setFechaHora] = useState<string>("");
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [cliente, setCliente] = useState<ClienteData | null>(null);

  const agregarDetalle = (servicio: Servicio) => {
    setDetalles((prev) =>
      prev.find((d) => d.servicio.id === servicio.id)
        ? prev
        : [...prev, { servicio }]
    );
  };

  const agregarDetalles = (servicios: Servicio[]) => {
    setDetalles((prev) => {
      const nuevosDetalles = servicios
        .filter((s) => !prev.find((d) => d.servicio.id === s.id))
        .map((s) => ({ servicio: s }));
      return [...prev, ...nuevosDetalles];
    });
  };

  const quitarDetalle = (servicioId: number) => {
    setDetalles((prev) => prev.filter((d) => d.servicio.id !== servicioId));
  };

  const servicios = detalles.map((d) => d.servicio);

  const resetTurno = () => {
    setSucursal(null);
    setDetalles([]);
    setFechaHora("");
    setEmpleado(null);
    setCliente(null);
  };

  return (
    <TurnoContext.Provider
      value={{
        sucursal,
        setSucursal,
        detalles,
        agregarDetalle,
        agregarDetalles,
        quitarDetalle,
        servicios,
        fechaHora,
        setFechaHora,
        empleado,
        setEmpleado,
        cliente,
        setCliente,
        resetTurno,
      }}
    >
      {children}
    </TurnoContext.Provider>
  );
};

export const useTurno = () => {
  const context = useContext(TurnoContext);
  if (!context) {
    throw new Error("useTurno debe usarse dentro de un TurnoProvider");
  }
  return context;
};
