import { useState, useCallback } from "react";
import Menu from "./component/menu";
import Resultado from "./component/Resultado";
import Menu2 from "./component/menu2";
import Correlativo_form from "./component/Correlativo_form";

const CONSULTAS_MONGO = [
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

const CONSULTAS_NEO4J = [
  "Listar aspirantes con su carrera objetivo",
  "Instituciones y número de aspirantes que estudian en ellas",
  "Instituciones con más aprobados",
  "Red de aspirantes con la misma carrera y materia",
  "Ubicación geográfica de instituciones educativas",
  "Crear relaciones de afinidad entre aspirantes con edad y aprobación similar",
  "Red de aspirantes conectados por compartir la misma materia y carrera objetivo",
  "Instituciones con aspirantes que aprobaron más de una materia",
  "Carreras con mayor diversidad de departamentos de origen (aspirantes por institución)",
  "Trayectoria de un aspirante: de institución → ubicación → carrera → resultado",
  "Comparar rendimiento entre instituciones de un mismo departamento",
  "Top carreras por conexión entre aspirantes e instituciones diversas",
];

function useConsultas(consultas) {
  const [parametro, setParametro] = useState("");
  const [requiereParametro, setRequiereParametro] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [consultaActiva, setConsultaActiva] = useState("");
  const [loading, setLoading] = useState(false);

  //Consultas al back para MongoDB y almacenamos la data en "data" para pasarla a los componentes
  const ejecutarConsulta = useCallback(async (id, param = "") => {
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
  }, []);

  const fetchConsulta = useCallback(
    async (id, nombre) => {
      setConsultaActiva(nombre);
      setResultado(null);
      if (id === 14) {
        setRequiereParametro(true);
        return;
      }
      await ejecutarConsulta(id);
      setRequiereParametro(false);
      setParametro("");
    },
    [ejecutarConsulta]
  );

  const enviarParametro = useCallback(() => {
    const id = consultas.findIndex((c) => c === consultaActiva) + 1;
    ejecutarConsulta(id, parametro);
    setRequiereParametro(false);
    setParametro("");
  }, [ejecutarConsulta, parametro, consultaActiva, consultas]);

  //Reset de estados para cambiar entre Mongo o Neo4j
  const resetEstado = useCallback(() => {
    setParametro("");
    setRequiereParametro(false);
    setResultado(null);
    setConsultaActiva("");
    setLoading(false);
  }, []);

  return {
    parametro,
    setParametro,
    requiereParametro,
    resultado,
    consultaActiva,
    loading,
    fetchConsulta,
    setConsultaActiva,
    setResultado,
    setRequiereParametro,
    enviarParametro,
    resetEstado,
  };
}

function Layout({
  consultas,
  consultaActiva,
  fetchConsulta,
  menuVisible,
  setMenuVisible,
  resultado,
  requiereParametro,
  parametro,
  setParametro,
  enviarParametro,
  loading,
  fuenteDatos,
  setConsultaActiva,
}) {
  // Para Neo4j, de momento solo mostramos el nombre (Aqui debe ir el consumo hacia el back)
  const handleSelectNeo4j = (nombre) => {
    setConsultaActiva(nombre);
  };

  return (
    <div style={{ display: "flex", flexGrow: 1 }}>
      <aside
        style={{
          flexBasis: menuVisible ? 250 : 60,
          transition: "flex-basis 0.3s",
          backgroundColor: "#f0f0f0",
          borderRight: "1px solid #ccc",
        }}
      >
        <Menu2 onToggle={() => setMenuVisible(!menuVisible)} />
        <Menu
          consultas={consultas}
          consultaActiva={consultaActiva}
          onSelect={
            fuenteDatos === "mongo"
              ? fetchConsulta
              : (id, nombre) => {
                  handleSelectNeo4j(nombre);
                }
          }
          visible={menuVisible}
        />
      </aside>

      <main
        style={{
          flexGrow: 1,
          backgroundColor: "#f9f9f9",
          padding: 20,
          overflowY: "auto",
        }}
      >
        {fuenteDatos === "mongo" && requiereParametro && (
          <Correlativo_form
            parametro={parametro}
            setParametro={setParametro}
            onSubmit={enviarParametro}
          />
        )}

        {fuenteDatos === "neo4j" && consultaActiva && (
          <div style={{ fontSize: 20, fontWeight: "bold" }}>
            Consulta seleccionada: {consultaActiva}
          </div>
        )}

        {fuenteDatos === "mongo" && (
          <Resultado
            data={resultado}
            consultaActiva={consultaActiva}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fuenteDatos, setFuenteDatos] = useState("mongo");

  const consultas = fuenteDatos === "mongo" ? CONSULTAS_MONGO : CONSULTAS_NEO4J;

  const {
    parametro,
    setParametro,
    requiereParametro,
    resultado,
    consultaActiva,
    loading,
    fetchConsulta,
    enviarParametro,
    resetEstado,
    setConsultaActiva,
  } = useConsultas(consultas);

  const cambiarFuente = (fuente) => {
    setFuenteDatos(fuente);
    setMenuVisible(false);
    resetEstado();
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          background: "linear-gradient(to right, #005fa3, #007acc)",
          color: "white",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
          Proyecto 1
        </h2>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => cambiarFuente("mongo")}
            style={topButtonStyle(fuenteDatos === "mongo")}
          >
            MongoDB
          </button>
          <button
            onClick={() => cambiarFuente("neo4j")}
            style={topButtonStyle(fuenteDatos === "neo4j")}
          >
            Neo4J
          </button>
        </div>
      </header>

      <Layout
        consultas={consultas}
        consultaActiva={consultaActiva}
        fetchConsulta={fetchConsulta}
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
        resultado={resultado}
        requiereParametro={requiereParametro}
        parametro={parametro}
        setParametro={setParametro}
        enviarParametro={enviarParametro}
        loading={loading}
        fuenteDatos={fuenteDatos}
        setConsultaActiva={setConsultaActiva}
      />
    </div>
  );
}

function topButtonStyle(activo) {
  return {
    padding: "10px 18px",
    fontSize: "15px",
    backgroundColor: activo ? "#003d6b" : "white",
    color: activo ? "white" : "#005fa3",
    border: "2px solid #005fa3",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: activo ? "0 0 10px rgba(0,0,0,0.2)" : "none",
  };
}
