import { useNavigate } from "react-router-dom";
import "./Comun.css";

const Home = () => {

  const navegar = useNavigate();

  return (
    <div className="container">
      <div className="header text-center">
        <h2>Laboratorio 0</h2>
        <h1 style={{ color: '#fb923c' }}>CRUD</h1>
        <p>Presentado por <b>PlanifiKlub</b>:</p>
        <ul className="list">

          <li>Jonathan Steven Ochoa Celis</li>
          <li>Luis Alfonso Diaz Vergel</li>
          <li>Maria Jose Jara Herrera</li>
          <li>Sergio Alexander Parada Amarillo</li>
        </ul>
      </div>
      <div className="button-container text-center">
        <button id="Personas" onClick={() => navegar("/personas")}>Personas</button>
        <button id="Vivienda" onClick={() => navegar("/viviendas")}>Vivienda</button>
        <button id="Propiedad de Vivienda" onClick={() => navegar("/")}>Propiedad de Vivienda</button>
        <button id="Residencia" onClick={() => navegar("/")}>Residencia</button>
        <button id="Municipios" onClick={() => navegar("/municipios")}>Municipios</button>
        <button id="Departamentos" onClick={() => navegar("/departamentos")}>Departamentos</button>
        <button id="Paises" onClick={() => navegar("/paises")}>Paises</button>
      </div>
    </div>
  );
}

export default Home;
