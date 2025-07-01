import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "@/api/AxiosInstance";

interface IngresoSucursal {
  sucursal: string;
  cejas: number;
  unas: number;
  pestanas: number;
  otros: number;
}

interface Props {
  anio: number
  mes: number
}

const IngresosSucursalPorCategoria: React.FC<Props> = ({ anio, mes }) => {
  const [data, setData] = useState<IngresoSucursal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/Reportes/ingresos-sucursales", {
        params: {
          anio: anio,
          mes: mes,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error cargando ingresos por sucursal", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Ingresos por sucursal (categorías)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="sucursal" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cejas" name="Cejas" />
              <Bar dataKey="unas" name="Uñas" />
              <Bar dataKey="pestanas" name="Pestañas" />
              <Bar dataKey="otros" name="Otros" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default IngresosSucursalPorCategoria;