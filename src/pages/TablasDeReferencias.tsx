import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BackToDashboardButton from "@/components/Volver";
import { Cog, SearchCode } from "lucide-react";
import Footer from '../components/Footer';

interface RefRow {
  Tabla: string;
  Codigo: string;
  Nombre: string;
}

export default function TablasDeReferencias() {
  const [data, setData] = useState<RefRow[]>([]);
  const [tablaSeleccionada, setTablaSeleccionada] = useState<string>("");
  const [filtro, setFiltro] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   // 🔹 Cargar archivo automáticamente desde public/assets/tables.csv
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const res = await fetch(import.meta.env.BASE_URL + "assets/tables.csv");
        if (!res.ok) throw new Error(`Error ${res.status}: No se pudo cargar el archivo`);

        const text = await res.text();

        const rows = text
          .split("\n")
          .map((row) => row.trim())
          .filter(Boolean);

        const parsed: RefRow[] = rows.slice(1).map((row) => {
          const [Tabla, Codigo, Nombre] = row.split(";");
          return { Tabla, Codigo, Nombre };
        });

        setData(parsed);
      } catch (err: any) {
        setError(err.message || "Error cargando CSV");
      } finally {
        setLoading(false);
      }
    };

    loadCSV();
  }, []);

  // 🔹 Tablas únicas
  const tablas = Array.from(new Set(data.map((row) => row.Tabla)));

  // 🔹 Filtrado
  const filtrados = data.filter(
    (row) =>
      (!tablaSeleccionada || row.Tabla === tablaSeleccionada) &&
      (row.Codigo.toLowerCase().includes(filtro.toLowerCase()) ||
        row.Nombre.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl shadow-lg">
              <SearchCode className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tablas de Referencias SISPRO
          </h1>
        </div>

        <div className="flex gap-4">
          <BackToDashboardButton />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tablas de Referencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p className="text-muted-foreground">Cargando datos...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && data.length > 0 && (
              <>
                {/* Controles */}
                <div className="flex gap-3 items-center">
                  <select
                    className="border rounded px-2 py-1"
                    value={tablaSeleccionada}
                    onChange={(e) => setTablaSeleccionada(e.target.value)}
                  >
                    <option value="">Todas las tablas</option>
                    {tablas.map((tabla) => (
                      <option key={tabla} value={tabla}>
                        {tabla}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="Filtrar por código o nombre"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="w-64"
                  />
                  <Badge variant="default">{filtrados.length} resultados</Badge>
                </div>

                {/* Tabla */}
                <div className="mt-4 max-h-96 overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left px-2 py-1">Código</th>
                        <th className="text-left px-2 py-1">Nombre</th>
                        <th className="text-left px-2 py-1">Tabla</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrados.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-2 py-1">{row.Codigo}</td>
                          <td className="px-2 py-1">{row.Nombre}</td>
                          <td className="px-2 py-1">{row.Tabla}</td>
                        </tr>
                      ))}
                      {filtrados.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No hay resultados para mostrar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none border-t mt-8">
          <CardContent>
            <Footer />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}