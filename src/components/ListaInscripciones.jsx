import { useEffect, useState } from "react";
import api from "../services/api";

export default function ListaInscripciones() {

  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [filtroTaller, setFiltroTaller] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const adminPassword = localStorage.getItem("adminPassword");

  const obtenerInscripciones = async () => {
    try {
      const res = await api.get("/inscripciones", {
        headers: { Authorization: adminPassword }
      });
      setInscripciones(res.data);
    } catch (error) {
      console.error("Error cargando inscripciones:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerInscripciones();
  }, []);

  const eliminarInscripcion = async (id) => {
    const confirmar = window.confirm("¿Eliminar inscripción?");
    if (!confirmar) return;

    try {
      await api.delete(`/inscripciones/${id}`, {
        headers: { Authorization: adminPassword }
      });
      setInscripciones(prev => prev.filter(i => i._id !== id));
    } catch (error) {
      console.error("Error eliminando inscripción:", error);
    }
  };

  const exportarPDF = async () => {
    try {
      const res = await api.get("/inscripciones/pdf", {
        headers: { Authorization: adminPassword },
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "inscriptos.pdf";
      link.click();
    } catch (error) {
      console.error("Error exportando PDF:", error);
    }
  };

  const exportarExcel = async () => {
    try {
      const res = await api.get("/inscripciones/excel", {
        headers: { Authorization: adminPassword },
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "inscriptos.xlsx";
      link.click();
    } catch (error) {
      console.error("Error exportando Excel:", error);
    }
  };

  /* LISTA DE TALLERES UNICOS */
  const talleres = [...new Set(inscripciones.map(i => i.taller))];

  /* FILTRADO POR TALLER Y BÚSQUEDA */
  const inscripcionesFiltradas = inscripciones
    .filter(i =>
      (filtroTaller === "todos" || i.taller === filtroTaller) &&
      i.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => a.nombre.localeCompare(b.nombre)); // Orden alfabético

  if (cargando) {
    return (
      <p className="text-center text-gray-500">
        Cargando inscripciones...
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Planilla de Inscriptos
      </h2>

      {/* BOTONES EXPORTAR Y FILTROS */}
      <div className="flex flex-wrap items-center gap-3">

        <button
          onClick={exportarExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
        >
          Exportar Excel
        </button>

        <button
          onClick={exportarPDF}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Exportar PDF
        </button>

        <select
          value={filtroTaller}
          onChange={(e) => setFiltroTaller(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="todos">Todos los talleres</option>
          {talleres.map((taller) => (
            <option key={taller} value={taller}>{taller}</option>
          ))}
        </select>

        <div className="text-sm bg-gray-200 px-3 py-1 rounded">
          Inscriptos: <b>{inscripcionesFiltradas.length}</b>
        </div>
      </div>

      {/* BÚSQUEDA POR NOMBRE */}
      <div className="mt-2">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border rounded px-2 py-1 w-full max-w-xs text-sm"
        />
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-xs border">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Dirección</th>
              <th className="p-2 border">Celular</th>
              <th className="p-2 border">Taller</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {inscripcionesFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-3 text-gray-500">
                  No hay inscripciones
                </td>
              </tr>
            ) : (
              inscripcionesFiltradas.map((inscripcion) => (
                <tr key={inscripcion._id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{inscripcion.nombre}</td>
                  <td className="border px-2 py-1">{inscripcion.direccion}</td>
                  <td className="border px-2 py-1">{inscripcion.celular}</td>
                  <td className="border px-2 py-1">{inscripcion.taller}</td>
                  <td className="border px-2 py-1">
                    {inscripcion.createdAt
                      ? new Date(inscripcion.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => eliminarInscripcion(inscripcion._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}