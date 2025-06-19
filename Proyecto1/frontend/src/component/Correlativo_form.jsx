
export default function Correlativo_form({ parametro, setParametro, onSubmit }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <label>
          Ingrese el correlativo de un aspirante:
          <input
            type="text"
            value={parametro}
            onChange={(e) => setParametro(e.target.value)}
            style={{
              marginLeft: 10,
              padding: "5px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            marginLeft: 10,
            padding: "6px 12px",
            backgroundColor: "#007acc",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Consultar
        </button>
      </form>
    </div>
  );
}
