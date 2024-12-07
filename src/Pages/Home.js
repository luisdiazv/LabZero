import { useNavigate } from "react-router-dom";
import "./Comun.css";

const Home = () => {

  const navegar = useNavigate();

  return (
    <div className="container">
      <div className="header text-center">
        <h2>Laboratorio 0</h2>
        <h1 style={{color: '#fb923c'}}>CRUD</h1>
        <p>Presentado por <b>PlanifiKlub</b>:</p>
        <ul className="list">
          <li>Díaz</li>
          <li>Jara</li>
          <li>Parada</li>
          <li>Ochoa</li>
        </ul>
      </div>
      <div className="button-container text-center">
        <button id="Personas" onClick={() => navegar("/personas")}>Personas</button>
        <button id="Viviendas" onClick={() => navegar("/personas")}>Viviendas</button>
        <button id="Municipios">Municipios</button>
        <button id="Propiedad de Vivienda">Propiedad de Vivienda</button>
      </div>
    </div>
  );
}

export default Home;
