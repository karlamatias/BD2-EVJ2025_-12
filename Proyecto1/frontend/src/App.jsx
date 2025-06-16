import { useState } from "react";
import Caratula from "./component/caratula";
import Menu from "./component/menu";
import Resultado from "./component/Resultado";
import Menu2 from "./component/menu2";
import Correlativo_form from "./component/Correlativo_form";

const consultas = [
  "Aspirantes por tipo de institución educativa",
  "Cantidad de aprobados por materia",
  "Aprobados por carrera y año",
  "Porcentaje de aprobación por materia",
  "Promedio de edad por carrera",
  "Promedio edad de aprobados por carrera e institución",
  "Distribución de aprobados por municipio y carrera",
  "Evaluaciones públicas por mes y materia",
  "Top 5 carreras (16-18 años)",
  "Historial por aspirante",
  "Distribución por sexo e institución",
  "Tasa aprobación por edad",
  "Prom intentos por materia",
  "Historial completo de un aspirante",
  "Carreras con más reprobados primer intento",
];



export default function App() {
  const [parametro, setParametro] = useState("");
  const [requiereParametro, setRequiereParametro] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [consultaActiva, setConsultaActiva] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const fetchConsulta = async (id, nombre) => {
    setConsultaActiva(nombre);
    setMenuVisible(false);

    if (id == 14) {
      setRequiereParametro(true);
      setResultado(null);
      return; 
    }

    await ejecutarConsulta(id);
  };

  const ejecutarConsulta = async (id, param = "") => {
  setLoading(true);
  try {
    const url = param
      ? `http://localhost:3001/consulta/${id}/${param}`
      : `http://localhost:3001/consulta/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    setResultado(data);
  } catch (error) {
    setResultado({ error: "Error al obtener datos" });
  }
  setLoading(false);
};


  if (showIntro) {
    return <Caratula onIngresar={() => setShowIntro(false)} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          flexBasis: menuVisible ? 250 : 60,
          transition: "flex-basis 0.3s",
        }}
      >
        <Menu2 onToggle={() => setMenuVisible(!menuVisible)} />
        <Menu
          consultas={consultas}
          consultaActiva={consultaActiva}
          onSelect={fetchConsulta}
          visible={menuVisible}
        />
      </div>

      <main
        style={{
          flexGrow: 1,
          backgroundColor: "#f9f9f9",
          padding: 20,
          borderRadius: 4,
          overflowY: "auto",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          transition: "margin 0.3s",
        }}
      >
        <h2 style={{ color: "#007acc", marginBottom: 20 }}>
          Resultado: {consultaActiva || "Selecciona una consulta"}
        </h2>

        {requiereParametro && (
          <Correlativo_form
            parametro={parametro}
            setParametro={setParametro}
            onSubmit={() => {
              const id = consultas.findIndex((c) => c === consultaActiva) + 1;
              ejecutarConsulta(id, parametro);
              setRequiereParametro(false);
              setParametro("");
            }}
          />
        )}


        <Resultado
          data={resultado}
          consultaActiva={consultaActiva}
          loading={loading}
        />
      </main>
    </div>
  );
}
