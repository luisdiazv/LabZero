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
          
          <li>Jonathan Steven Ochoa Celis</li>
          <li>Luis Alfonso Diaz Vergel</li>
          <li>Maria Jose Jara Herrera</li>
          <li>Sergio Alexander Parada Amarillo</li>
        </ul>
      </div>
      <div className="button-container text-center">
        <button id="Personas" onClick={() => navegar("/personas")}>Personas</button>
        <button id="Viviendas" onClick={() => navegar("/viviendas")}>Viviendas</button>
        <button id="Municipios" onClick={() => navegar("/municipios")}>Municipios</button>
        <button id="Propiedad de Vivienda" onClick={() => navegar("/propVivienda")}>Propiedad de Vivienda</button>
      </div>
    </div>
  );
}

export default Home;
