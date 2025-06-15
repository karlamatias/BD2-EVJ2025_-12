export default function Menu({ consultas, consultaActiva, onSelect, visible }) {
  if (!visible) return null;

  return (
    <nav
      style={{
        maxWidth: 280,
        minWidth: 200,
        borderRight: "1px solid #ddd",
        backgroundColor: "#ffffff",
        padding: "20px 10px",
        display: "flex",
        flexDirection: "column",
        height: "100vh", // Aquí el cambio clave
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          margin: "0 0 16px 0",
          color: "#007acc",
          fontSize: "18px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Consultas
      </h2>

      <div
        style={{
          overflowY: "auto",
          flexGrow: 1,
          paddingRight: 6,
        }}
      >
        {consultas.map((consulta, i) => (
          <button
            key={i}
            onClick={() => onSelect(i + 1, consulta)}
            style={{
              display: "block",
              marginBottom: 8,
              padding: "10px 12px",
              width: "100%",
              cursor: "pointer",
              borderRadius: 8,
              border: "none",
              backgroundColor:
                consultaActiva === consulta ? "#007acc" : "#e6f4ff",
              color: consultaActiva === consulta ? "#fff" : "#007acc",
              fontWeight: consultaActiva === consulta ? "bold" : "500",
              boxShadow:
                consultaActiva === consulta
                  ? "0 0 5px rgba(0,122,204,0.5)"
                  : "inset 0 0 0 1px #007acc",
              transition: "all 0.2s",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            {consulta}
          </button>
        ))}
      </div>
    </nav>
  );
}
