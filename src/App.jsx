import Inscripcion from "./pages/Inscripcion";
import Admin from "./pages/Admin";

function App() {

  const ruta = window.location.pathname;

  if (ruta === "/admin") {
    return <Admin />;
  }

  return <Inscripcion />;
}

export default App;