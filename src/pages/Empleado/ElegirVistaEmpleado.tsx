import { useEffect, useState } from "react";
import axios from "@/api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Sucursal {
  id: number;
  nombre: string;
}

interface Sector {
  id: number;
  nombre: string;
  sucursalId: number;
}

interface Empleada {
  id: number;
  nombre: string;
  apellido: string;
}

const ElegirVistaEmpleado = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [empleadas, setEmpleadas] = useState<Empleada[]>([]);

  const [sucursalId, setSucursalId] = useState<string>("");
  const [sectorId, setSectorId] = useState<string>("");
  const [empleadaId, setEmpleadaId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/sucursal").then(res => setSucursales(res.data));
  }, []);

  useEffect(() => {
    if (!sucursalId) return;
    axios.get(`/api/Sector/sucursal/${sucursalId}`).then(res => setSectores(res.data));
    setSectorId("");
    setEmpleadas([]);
  }, [sucursalId]);

  useEffect(() => {
    if (!sectorId) return;
    axios.get(`/api/Empleado`).then(res => setEmpleadas(res.data)); ///sector/${sectorId}
    setEmpleadaId("");
  }, [sectorId]);

  const handleContinuar = () => {
    if (empleadaId) {
      navigate(`/vista-empleado/${empleadaId}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar vista de empleada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Sucursal</Label>
            <Select onValueChange={setSucursalId} value={sucursalId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una sucursal" />
              </SelectTrigger>
              <SelectContent>
                {sucursales.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sector</Label>
            <Select onValueChange={setSectorId} value={sectorId} disabled={!sucursalId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un sector" />
              </SelectTrigger>
              <SelectContent>
                {sectores.map(sector => (
                  <SelectItem key={sector.id} value={sector.id.toString()}>
                    {sector.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Empleada</Label>
            <Select onValueChange={setEmpleadaId} value={empleadaId} disabled={!sectorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una empleada" />
              </SelectTrigger>
              <SelectContent>
                {empleadas.map(e => (
                  <SelectItem key={e.id} value={e.id.toString()}>
                    {e.nombre} {e.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleContinuar} disabled={!empleadaId}>
            Ver turnos del día
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElegirVistaEmpleado;