export function OgCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#10140f",
        color: "#f4f1e8",
        padding: "72px",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#d6f25c" }}>
        FULL-STACK WEB DEVELOPER
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.02, fontWeight: 600 }}>
          Mohamed Amine Mzoughi
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 32, color: "#b4b09f" }}>
          Tunis, Tunisia · 6 years
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 28, color: "#d6f25c" }}>visitor@mzoughi:~$ help</div>
    </div>
  );
}
