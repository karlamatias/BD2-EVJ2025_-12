import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function isIdObject(data) {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0]._id === "object" &&
    data[0]._id !== null
  );
}

function renderTable(data) {
  if (!Array.isArray(data) || data.length === 0)
    return <p>No hay datos para mostrar.</p>;

  if (isIdObject(data)) {
    const idKeys = Object.keys(data[0]._id);
    const otherKeys = Object.keys(data[0]).filter((k) => k !== "_id");

    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#007acc", color: "white" }}>
            {idKeys.map((key) => (
              <th
                key={key}
                style={{
                  padding: 8,
                  border: "1px solid #ccc",
                  textAlign: "left",
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
            {otherKeys.map((key) => (
              <th
                key={key}
                style={{
                  padding: 8,
                  border: "1px solid #ccc",
                  textAlign: "left",
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              style={{ backgroundColor: i % 2 === 0 ? "#f0f8ff" : "white" }}
            >
              {idKeys.map((key) => (
                <td key={key} style={{ padding: 8, border: "1px solid #ccc" }}>
                  {row._id[key]}
                </td>
              ))}
              {otherKeys.map((key) => (
                <td key={key} style={{ padding: 8, border: "1px solid #ccc" }}>
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const keys = new Set();
  data.forEach((item) => Object.keys(item).forEach((k) => keys.add(k)));
  const columns = Array.from(keys);

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr style={{ backgroundColor: "#007acc", color: "white" }}>
          {columns.map((col) => (
            <th
              key={col}
              style={{
                padding: 8,
                border: "1px solid #ccc",
                textAlign: "left",
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={i}
            style={{ backgroundColor: i % 2 === 0 ? "#f0f8ff" : "white" }}
          >
            {columns.map((col) => {
              let valor = row[col];
              if (typeof valor === "object" && valor !== null)
                valor = JSON.stringify(valor);
              return (
                <td key={col} style={{ padding: 8, border: "1px solid #ccc" }}>
                  {valor !== undefined ? valor.toString() : ""}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderChart(data) {
  if (!Array.isArray(data) || data.length === 0)
    return <p>No hay datos para mostrar.</p>;

  const formattedData = data.map((item) => {
    let label = item._id;
    if (typeof label === "object" && label !== null) {
      label = Object.values(label).join(" - ");
    } else if (label === null || label === undefined) {
      label = "";
    } else {
      label = label.toString();
    }
    return {
      ...item,
      label,
    };
  });

  const keysNum = Object.keys(formattedData[0]).filter(
    (k) =>
      k !== "_id" && k !== "label" && typeof formattedData[0][k] === "number"
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        {keysNum.map((key) => (
          <Bar key={key} dataKey={key} fill="#007acc" />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Resultado({ data, consultaActiva, loading }) {
  const consultasGrafica = [
    "Aspirantes por tipo de institución educativa",
    "Cantidad de aprobados por materia",
    "Aprobados por carrera y año",
    "Porcentaje de aprobación por materia",
    "Top 5 carreras (16-18 años)",
    "Carreras con más reprobados primer intento",
  ];

  if (loading) return <p>Cargando datos...</p>;
  if (!data) return <p>Sin datos aún</p>;
  if (data.error) return <p style={{ color: "red" }}>{data.error}</p>;

  const mostrarGrafica = consultasGrafica.includes(consultaActiva);

  return (
    <>
      {renderTable(data)}
      {mostrarGrafica && renderChart(data)}
    </>
  );
}
