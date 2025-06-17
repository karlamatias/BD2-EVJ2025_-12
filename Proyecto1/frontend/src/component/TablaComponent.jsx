import tablaConfigPorConsulta from "./tablaConfig";

const cellStyle = {
  padding: "12px",
  border: "1px solid #e0e0e0",
  textAlign: "left",
  fontSize: "14px",
};

function isIdObject(data) {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0]._id === "object" &&
    data[0]._id !== null
  );
}

export default function TablaComponent({ data, consultaActiva }) {
  if (!Array.isArray(data) || data.length === 0)
    return <p>No hay datos para mostrar.</p>;

  const config = tablaConfigPorConsulta[consultaActiva] || {};
  const alias = config.alias || {};
  const orden = config.orden || null;

  const headerStyle = {
    ...cellStyle,
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    borderBottom: "2px solid #ccc",
  };

  const rowStyle = (i) => ({
    backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa",
  });

  const renderTable = (columns, rowGenerator) => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        borderRadius: "8px",
        boxShadow: "0 0 8px rgba(0,0,0,0.05)",
      }}
    >
      <thead>
        <tr>
          {columns.map((key) => (
            <th key={key} style={headerStyle}>
              {alias[key] || key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((row, i) => rowGenerator(row, i, columns))}</tbody>
    </table>
  );

  if (isIdObject(data)) {
    const idKeys = Object.keys(data[0]._id);
    const otherKeys = Object.keys(data[0]).filter((k) => k !== "_id");
    const columns = orden || [...idKeys, ...otherKeys];

    return renderTable(columns, (row, i, columns) => (
      <tr key={i} style={rowStyle(i)}>
        {columns.map((key) => {
          const valor = row[key] !== undefined ? row[key] : row._id?.[key];
          return (
            <td key={key} style={cellStyle}>
              {valor?.toString() || ""}
            </td>
          );
        })}
      </tr>
    ));
  }

  const keys = Array.from(new Set(data.flatMap(Object.keys)));
  const columns = orden || keys;

  return renderTable(columns, (row, i, columns) => (
    <tr key={i} style={rowStyle(i)}>
      {columns.map((col) => {
        let valor = row[col];
        if (typeof valor === "object" && valor !== null)
          valor = JSON.stringify(valor);
        return (
          <td key={col} style={cellStyle}>
            {valor?.toString() || ""}
          </td>
        );
      })}
    </tr>
  ));
}
