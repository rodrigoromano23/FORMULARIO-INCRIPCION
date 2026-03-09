import { useEffect, useState } from "react";
import api from "../services/api";

export default function EstadoInscriptos() {

  const [alumnos, setAlumnos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [pagoAlumno, setPagoAlumno] = useState(null);
  const [vista, setVista] = useState("agregar");
  const [filtroEstado, setFiltroEstado] = useState(null);
  

  const adminPassword = localStorage.getItem("adminPassword");

  /* INSCRIPTOS */

  const obtenerAlumnos = async () => {
    try {

      const res = await api.get("/inscripciones", {
        headers: { Authorization: adminPassword }
      });

      setAlumnos(res.data);

    } catch (error) {

      console.error("Error cargando alumnos", error);

    }
  };

  /* PAGOS */

  const obtenerPagos = async () => {

    try {

      const res = await api.get("pagos", {
        headers: { Authorization: adminPassword }
      });

      setPagos(res.data);

    } catch (error) {

      console.error("Error cargando pagos", error);

    }

  };

  useEffect(() => {

    obtenerAlumnos();
    obtenerPagos();

  }, []);

  /* CALCULAR ESTADO */

  const calcularEstado = (pagos) => {

  if (!pagos || pagos.length === 0) {
    return "aAbonar";
  }

  const ultimoPago = new Date(pagos[pagos.length - 1].fechaPago);

  const vencimiento = new Date(ultimoPago);
  vencimiento.setMonth(vencimiento.getMonth() + 1);

  const hoy = new Date();

  const diff = (vencimiento - hoy) / (1000 * 60 * 60 * 24);

  if (diff < 0) return "vencido";
  if (diff <= 5) return "proximo";

  return "alDia";
};

  const pagosConEstado = pagos.map(p => ({
  ...p,
  estadoCalculado: calcularEstado(p.pagos)
}));

  /* CONTADORES */

  const aAbonar = pagosConEstado.filter(p => p.estadoCalculado === "aAbonar").length;

  const deben = pagosConEstado.filter(p => p.estadoCalculado === "vencido").length;

  const proximos = pagosConEstado.filter(p => p.estadoCalculado === "proximo").length;

  const alDia = pagosConEstado.filter(p => p.estadoCalculado === "alDia").length;

  /* FILTRO */

  const pagosFiltrados = filtroEstado
    ? pagosConEstado.filter(p => p.estadoCalculado === filtroEstado)
    : pagosConEstado;
// estilos de estados//
const obtenerEstiloEstado = (estado) => {

  switch (estado) {

    case "aAbonar":
      return {
        background: "#6c757d",
        color: "#fff",
        texto: "A abonar"
      };

    case "vencido":
      return {
        background: "#dc3545",
        color: "#fff",
        texto: "Vencido"
      };

    case "proximo":
      return {
        background: "#fd7e14",
        color: "#000",
        texto: "A punto de vencer"
      };

    case "alDia":
      return {
        background: "#28a745",
        color: "#000",
        texto: "Al día"
      };

    default:
      return {
        background: "#ccc",
        color: "#000",
        texto: "Sin estado"
      };
  }

};
  /* AGREGAR A PAGOS */

const agregarAPagos = async (alumno) => {

  try {

    await api.post("pagos", {

      inscripcionId: alumno._id

    }, {
      headers: { Authorization: adminPassword }
    });

    obtenerPagos();

  } catch (error) {

    console.error("Error agregando a pagos", error);

  }

};

  /* QUITAR DE PAGOS */

  const quitarDePagos = async (id) => {

    try {

      await api.delete(`pagos/${id}`, {
        headers: { Authorization: adminPassword }
      });

      obtenerPagos();

    } catch (error) {

      console.error("Error quitando de pagos", error);

    }

  };

  /* REGISTRAR PAGO */

  const guardarPago = async () => {
  if (!pagoAlumno) return;

  try {
    await api.post(`/pagos/${pagoAlumno._id}/pago`, {
      monto: pagoAlumno.monto,
      metodoPago: pagoAlumno.tipoPago,
      fechaPago: pagoAlumno.fechaPago
    }, {
      headers: { Authorization: adminPassword }
    });

    setPagoAlumno(null);
    await obtenerPagos();

    alert("Pago registrado");

  } catch (error) {
    console.error("Error guardando pago:", error.response?.data || error.message);
  }
};

  return (

    <div className="p-6 space-y-6 bg-black text-white min-h-screen">

      <h2 className="text-2xl font-bold">
        Gestión de Pagos
      </h2>

      {/* MENU */}

      <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">

        <div className="flex gap-3">

          <button
            onClick={() => setVista("agregar")}
            className={`px-4 py-2 rounded ${
              vista === "agregar"
                ? "bg-blue-600"
                : "bg-gray-800 border border-gray-600"
            }`}
          >
            Agregar
          </button>

          <button
            onClick={() => setVista("estados")}
            className={`px-4 py-2 rounded ${
              vista === "estados"
                ? "bg-blue-600"
                : "bg-gray-800 border border-gray-600"
            }`}
          >
            Estados
          </button>

        </div>

        {/* NOTIFICACIONES */}

        <div className="flex gap-3">
          <div
            onClick={() => setFiltroEstado("aAbonar")}
            className="cursor-pointer w-9 h-9 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold"
          >
            {aAbonar}
          </div>

          <div
            onClick={() => setFiltroEstado("vencido")}
            className="cursor-pointer w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold"
          >
            {deben}
          </div>

          <div
            onClick={() => setFiltroEstado("proximo")}
            className="cursor-pointer w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-bold"
          >
            {proximos}
          </div>

          <div
            onClick={() => setFiltroEstado("alDia")}
            className="cursor-pointer w-9 h-9 rounded-full bg-green-600 flex items-center justify-center font-bold"
          >
            {alDia}
          </div>

        </div>

      </div>

      {/* VISTA AGREGAR */}

      {vista === "agregar" && (

        <table className="w-full border border-gray-700">

          <thead className="bg-gray-900">
            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Direccion</th>
              <th className="border p-2">Taller</th>
              <th className="border p-2">Celular</th>
              <th className="border p-2">Acción</th>
            </tr>
          </thead>

          <tbody>

            {alumnos.map((a) => {

              const pago = pagos.find(p => p.alumnoId === a._id);

              return (

                <tr key={a._id}>

                  <td className="border p-2">{a.nombre}</td>
                  <td className="border p-2">{a.direccion}</td>
                  <td className="border p-2">{a.taller}</td>
                  <td className="border p-2">{a.celular}</td>

                  <td className="border p-2">

                    {pago ? (

                      <button
                        onClick={() => quitarDePagos(pago._id)}
                        className="bg-red-600 px-3 py-1 rounded"
                      >
                        Quitar
                      </button>

                    ) : (

                      <button
                        onClick={() => agregarAPagos(a)}
                        className="bg-green-600 px-3 py-1 rounded"
                      >
                        Agregar a pagos
                      </button>

                    )}

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      )}

      {/* VISTA ESTADOS */}

      {vista === "estados" && (

        <table className="w-full border border-gray-700">

          <thead className="bg-gray-900">

            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Direccion</th>
              <th className="border p-2">Telefono</th>
              <th className="border p-2">Taller</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Pago</th>
            </tr>

          </thead>

          <tbody>

            {pagosFiltrados.map((p) => (

              <tr key={p._id}>

                <td className="border p-2">{p.alumnoNombre}</td>
                <td className="border p-2">{p.direccion}</td>
                <td className="border p-2">{p.telefono}</td>
                <td className="border p-2">{p.taller}</td>

                <td className="border p-2">
                  {(() => {
                    const estilo = obtenerEstiloEstado(p.estadoCalculado);

                    return (
                      <span
                        style={{
                          background: estilo.background,
                          color: estilo.color,
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontWeight: "bold"
                        }}
                      >
                        {estilo.texto}
                      </span>
                    );
                  })()}
                </td>

                <td className="border p-2">

                  <button
                    onClick={() => setPagoAlumno(p)}
                    className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Registrar pago
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

      {/* MODAL PAGO */}

      {pagoAlumno && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/70">

          <div className="bg-gray-900 p-6 rounded-xl w-96 space-y-4">

            <h3 className="text-lg font-bold">
              Registrar pago
            </h3>

            <input
              type="number"
              placeholder="Monto"
              onChange={(e) =>
                setPagoAlumno({ ...pagoAlumno, monto: e.target.value })
              }
              className="w-full bg-black border p-2 rounded"
            />

            <select
              onChange={(e) =>
                setPagoAlumno({ ...pagoAlumno, tipoPago: e.target.value })
              }
              className="w-full bg-black border p-2 rounded"
            >
              <option>Tipo de pago</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
            </select>

            <input
              type="date"
              onChange={(e) =>
                setPagoAlumno({ ...pagoAlumno, fechaPago: e.target.value })
              }
              className="w-full bg-black border p-2 rounded"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setPagoAlumno(null)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={guardarPago}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Guardar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}