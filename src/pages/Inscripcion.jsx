import { useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

export default function Inscripcion() {

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    celular: "",
    taller: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const enviar = async (e) => {
    e.preventDefault();

    try {

      await api.post("/inscripciones", form);

      Swal.fire({
        icon: "success",
        title: "Inscripción enviada",
        text: "Te registraste correctamente en el taller",
        confirmButtonColor: "#2563eb"
      });

      setForm({
        nombre: "",
        direccion: "",
        celular: "",
        taller: ""
      });

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar la inscripción"
      });

    }
  };

return (
  <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">

    {/* IMAGENES */}
    <div className="flex flex-col items-center gap-4 mb-6 w-full max-w-md">

      <img
        src="/taller1.png"
        alt="Electricidad y Reparaciones"
        className="w-full rounded-lg shadow"
      />

      <img
        src="/pintura en tela1.png"
        alt="Pintura en tela"
        className="w-full rounded-lg shadow"
      />

    </div>
    {/* INFORMACION DE LOS TALLERES */}

<div className="bg-white max-w-md w-full rounded-xl shadow p-5 mb-6 text-sm text-gray-700 space-y-2">

  <h2 className="text-lg font-semibold text-center">
    Información de los Talleres
  </h2>

  <p>
    Para sumarte a los talleres debes completar el formulario que se encuentra al final de esta página.
  </p>

  <ul className="list-disc pl-5 space-y-1">

    <li>
      Duración: desde el inicio del curso hasta los primeros días de noviembre.
    </li>

    <li>
      Cuota mensual: <b>$10.000</b>.
    </li>

    <li>
      Con entrega <b> de certificado </b> al finalizar el taller.
    </li>

    <li>
      La información completa del cursado se explicará el día de la primera clase.
    </li>

    <li>
      Para consultas comunicarse al <b>3834-537775</b>.
    </li>

  </ul>

  <p className="text-xs text-gray-500 text-center pt-2">
     Se recomienda completar la inscripción.
  </p>

</div>

    {/* FORMULARIO */}
    <form
      onSubmit={enviar}
      className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
    >

      <h1 className="text-2xl font-bold text-center">
        Inscripción a Talleres
      </h1>

      <input
        name="nombre"
        placeholder="Apellido/s y Nombre/s"
        value={form.nombre}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="direccion"
        placeholder="Dirección"
        value={form.direccion}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="celular"
        placeholder="Celular"
        value={form.celular}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <select
        name="taller"
        value={form.taller}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Seleccionar Taller</option>

        <option value="Electricidad">
          Electricidad y Reparaciones
        </option>

        <option value="Pintura en tela">
          Pintura en tela
        </option>

      </select>

      <button
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Inscribirse
      </button>

    </form>

  </div>
);
}