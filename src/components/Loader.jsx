export default function Loader({
  inline = false,
  size = 80,
  label = "Loading…",
}) {
  return (
    <div
      className={
        inline
          ? "flex items-center justify-center w-full py-16"
          : "flex items-center justify-center h-[100vh] bg-white"
      }
    >
      <div className="container" style={{ perspective: "1000px" }}>
        <img
          src="../public/favicon-logo.svg"
          alt=""
          width={size}
          height={size}
          className="animate-[coinSpin_1.6s_linear_infinite] [transform-style:preserve-3d]"
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
