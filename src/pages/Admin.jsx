import { useState, useEffect } from "react";
import api from "../services/api";

import AdminHeader from "../components/AdminHeader";
import ListaInscripciones from "../components/ListaInscripciones";
import ParticipantesEvento from "../components/ParticipantesEvento";
import Pagos from "../components/Pagos";

export default function Admin() {

  const [password, setPassword] = useState("");
  const [autorizado, setAutorizado] = useState(false);
  const [vista, setVista] = useState("inscripciones");

  useEffect(() => {

    const passGuardada = localStorage.getItem("adminPassword");

    if (passGuardada) {
      setPassword(passGuardada);
      setAutorizado(true);
    }

  }, []);

  const login = async () => {

    try {

      await api.get("/inscripciones", {
        headers: {
          Authorization: password
        }
      });

      localStorage.setItem("adminPassword", password);

      setAutorizado(true);

    } catch (error) {

      alert("Contraseña incorrecta");

    }

  };

  const cerrarSesion = () => {

    localStorage.removeItem("adminPassword");
    setAutorizado(false);
    setPassword("");

  };

  /* LOGIN */

  if (!autorizado) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-6 rounded shadow space-y-4 w-80">

          <h2 className="text-xl font-bold text-center">
            Panel Administrador
          </h2>

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <button
            onClick={login}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
          >
            Ingresar
          </button>

        </div>

      </div>

    );

  }

  /* PANEL */

  return (

    <div>

      <AdminHeader
        vista={vista}
        setVista={setVista}
        logout={cerrarSesion}
      />

      <div className="p-6">

        {vista === "inscripciones" && <ListaInscripciones />}

        {vista === "participantes" && <ParticipantesEvento />}

        {vista === "pagos" && <Pagos />}

      </div>

    </div>

  );

}