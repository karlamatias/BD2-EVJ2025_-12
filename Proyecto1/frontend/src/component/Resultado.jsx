import { useState } from "react";
import GraficaBarrasComponent from "./graficas/GraficaBarrasComponent";
import GraficaLineasComponent from "./graficas/GraficaLineasComponent";
import GraficaPieComponent from "./graficas/GraficaPieComponent";
import TablaComponent from "./TablaComponent";

//Caso para mostrar una grafica u otra
function getChartComponent(consulta, data) {
  switch (consulta) {
    case "1. Aspirantes por tipo de institución educativa":
    case "10. Top 5 carreras (16-18 años)":
    case "14. Prom intentos por materia":
    case "3. Aprobados por carrera y año":
      return <GraficaPieComponent data={data} />;
    case "9. Evaluaciones públicas por mes y materia":
    case "13. Tasa aprobación por edad":
    case "16. Carreras con más reprobados primer intento":
      return <GraficaLineasComponent data={data} />;
    default:
      return <GraficaBarrasComponent data={data} />;
  }
}

export default function Resultado({ data, consultaActiva, loading }) {
  const [vista, setVista] = useState("tabla");

  //Mostramos las consultas que van a llevar graficas (No son todas)
  const consultasGrafica = [
    "1. Aspirantes por tipo de institución educativa",
    "2. Cantidad de aprobados por materia",
    "3. Aprobados por carrera y año",
    "4. Porcentaje de aprobación por materia",
    "5. Promedio de edad por carrera",
    "6. Promedio edad de aprobados por carrera e institución",
    "8. Distribución de aprobados por municipio y carrera",
    "9. Evaluaciones públicas por mes y materia",
    "10. Top 5 carreras (16-18 años)",
    "13. Tasa aprobación por edad",
    "14. Prom intentos por materia",
    "16. Carreras con más reprobados primer intento",
  ];

  if (loading) return <p>Cargando datos...</p>;
  if (!data) return <p>Sin datos aún</p>;
  if (data.error) return <p style={{ color: "red" }}>{data.error}</p>;

  const mostrarGrafica = consultasGrafica.includes(consultaActiva);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10, fontWeight: "bold" }}>Ver como:</label>
        <select
          value={vista}
          onChange={(e) => setVista(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          {/* Select para mostrar resultados en tabla, grafica o json puro */}
          <option value="tabla">Tabla</option>
          {mostrarGrafica && <option value="grafica">Gráfica</option>}
          <option value="json">JSON</option>
        </select>
      </div>

        {/* Si el usuario selecciona esta opcion renderizamos la tabla con los resultados*/}
      {vista === "tabla" && (
        <TablaComponent data={data} consultaActiva={consultaActiva} />
      )}

      {/* Renderizamos las graficas si es el caso */}
      {vista === "grafica" && mostrarGrafica && (
        <div style={{ marginTop: "30px" }}>
          {getChartComponent(consultaActiva, data)}
        </div>
      )}

      {/* Renderizamos el Json puro que viene del back */}
      {vista === "json" && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: 20,
            borderRadius: 6,
            overflowX: "auto",
            maxHeight: "500px",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
