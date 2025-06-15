export default function Menu2({ onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        background: "transparent", 
        border: "none",
        padding: "10px",
        fontSize: "24px",
        cursor: "pointer",
        color: "#333",
        alignSelf: "flex-start", 
      }}
    >
      ☰
    </button>
  );
}