import { useEffect, useState } from "react";
import api from "../services/api";

export default function ListaInscripciones() {

  const [pagos, setPagos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const adminPassword = localStorage.getItem("adminPassword");

  const obtenerPagos = async () => {

    try {

      const res = await api.get("/pagos", {
        headers: {
          Authorization: adminPassword
        }
      });

      setPagos(res.data);

    } catch (error) {

      console.error("Error cargando pagos", error);

    } finally {

      setCargando(false);

    }

  };

  useEffect(() => {
    obtenerPagos();
  }, []);

  const pagosFiltrados = pagos.filter((p) =>
    p.alumnoNombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) return <p className="text-white p-6">Cargando pagos...</p>;

  return (

    <div className="min-h-screen bg-black text-white p-6">

      <div className="max-w-5xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">
          Buscador de alumnos
        </h2>

        {/* BUSCADOR */}

        <input
          type="text"
          placeholder="Buscar alumno por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 p-3 rounded mb-8 text-white"
        />

        {/* RESULTADOS */}

        {busqueda.length > 0 && pagosFiltrados.map((alumno) => (

          <div
            key={alumno._id}
            className="border border-gray-700 bg-gray-900 p-6 rounded-lg mb-8"
          >

            {/* NOMBRE */}

            <div className="text-xl font-bold mb-3">
              {alumno.alumnoNombre}
            </div>

            {/* DATOS */}

            <div className="flex flex-wrap gap-6 text-sm mb-6">

              <span>
                <strong>Dirección:</strong> {alumno.direccion || "-"}
              </span>

              <span>
                <strong>Tel:</strong> {alumno.telefono || "-"}
              </span>

              <span>
                <strong>Taller:</strong> {alumno.taller || "-"}
              </span>

            </div>

            {/* HISTORIAL */}

            <div className="font-semibold mb-3">
              Historial de pagos
            </div>

            {alumno.pagos && alumno.pagos.length > 0 ? (

              <table className="w-full text-sm border border-gray-700">

                <thead className="bg-gray-800">

                  <tr>
                    <th className="border border-gray-700 p-2">Fecha</th>
                    <th className="border border-gray-700 p-2">Monto</th>
                    <th className="border border-gray-700 p-2">Método</th>
                  </tr>

                </thead>

                <tbody>

                  {alumno.pagos.map((pago, i) => (

                    <tr key={i} className="text-center">

                      <td className="border border-gray-700 p-2">
                        {new Date(pago.fechaPago).toLocaleDateString()}
                      </td>

                      <td className="border border-gray-700 p-2">
                        ${pago.monto}
                      </td>

                      <td className="border border-gray-700 p-2">
                        {pago.metodoPago}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            ) : (

              <p className="text-gray-400">
                Este alumno aún no registra pagos.
              </p>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}