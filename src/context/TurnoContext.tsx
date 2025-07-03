import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipos
interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

interface Extra {
  id: number;
  nombre: string;
  duracionMinutos: number;
  precio: number;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  duracionMinutos: number;
  precio: number;
  extras?: Extra[]; // <-- agrega esto
}

interface DetalleTurno {
  servicio: Servicio;
  extras: Extra[]; // <-- agrega esto
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
  agregarExtra: (servicioId: number, extra: Extra) => void;
  quitarExtra: (servicioId: number, extraId: number) => void;
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
        : [...prev, { servicio, extras: [] }]
    );
  };

  const agregarExtra = (servicioId: number, extra: Extra) => {
    setDetalles((prev) =>
      prev.map((d) =>
        d.servicio.id === servicioId
          ? { ...d, extras: [...d.extras, extra] }
          : d
      )
    );
  };

  const quitarExtra = (servicioId: number, extraId: number) => {
    setDetalles((prev) =>
      prev.map((d) =>
        d.servicio.id === servicioId
          ? { ...d, extras: d.extras.filter((e) => e.id !== extraId) }
          : d
      )
    );
  };

  const agregarDetalles = (servicios: Servicio[]) => {
    setDetalles((prev) => {
      const nuevosDetalles = servicios
        .filter((s) => !prev.find((d) => d.servicio.id === s.id))
        .map((s) => ({ servicio: s, extras: [] }));
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
        agregarExtra,
        quitarExtra,
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
