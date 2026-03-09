export default function AdminHeader({ vista, setVista, logout }) {

  const base =
    "px-4 py-2 rounded-md transition duration-200 font-medium";

  const activo =
    "bg-cyan-600 text-white";

  const normal =
    "text-gray-300 hover:bg-cyan-500 hover:text-white";

  return (

    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* TITULO */}

        <h1 className="text-lg font-semibold tracking-wide">
          Panel Administrador
        </h1>

        {/* MENU */}

        <nav className="flex gap-2 flex-wrap">

          <button
            onClick={() => setVista("inscripciones")}
            className={`${base} ${
              vista === "inscripciones" ? activo : normal
            }`}
          >
            Inscripciones
          </button>

          <button
            onClick={() => setVista("participantes")}
            className={`${base} ${
              vista === "participantes" ? activo : normal
            }`}
          >
            Estado de inscriptos
          </button>

          <button
            onClick={() => setVista("pagos")}
            className={`${base} ${
              vista === "pagos" ? activo : normal
            }`}
          >
            Pagos
          </button>

          <button
            onClick={() => setVista("estadisticas")}
            className={`${base} ${
              vista === "estadisticas" ? activo : normal
            }`}
          >
            Estadísticas
          </button>

        </nav>

        {/* LOGOUT */}

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition"
        >
          Cerrar sesión
        </button>

      </div>

    </header>

  );

}