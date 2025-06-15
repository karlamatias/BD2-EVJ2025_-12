import logoUSAC from '../assets/descarga.jpg'; 

export default function Caratula({ onIngresar }) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#007acc",
        color: "white",
        textAlign: "center",
        padding: 20,
      }}
    >
      <img
        src={logoUSAC}
        alt="Logo USAC"
        style={{ width: 150, marginBottom: 20 }}
      />
      <h1 style={{ fontSize: 48, marginBottom: 20 }}>Proyecto 1</h1>
      <button
        onClick={onIngresar}
        style={{
          padding: "12px 30px",
          fontSize: 20,
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
          backgroundColor: "white",
          color: "#007acc",
          fontWeight: "bold",
          boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#ddd")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
      >
        Ingresar
      </button>
    </div>
  );
}
