/**
 * Loader component.
 *
 * - Displays a loading spinner with optional customization.
 * - Supports inline or full-page loading states.
 * - Includes an accessible label for screen readers.
 *
 * @param {object} props - Component props.
 * @param {boolean} [props.inline=false] - Whether the loader should be displayed inline or as a full-page overlay.
 * @param {number} [props.size=80] - The size of the loader in pixels.
 * @param {string} [props.label="Loading…"] - The accessible label for the loader (used for screen readers).
 * @returns {JSX.Element} The rendered loader component.
 */

import logo from "/favicon-logo.svg";

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
          : "flex items-center justify-center h-[100vh] bg-[color:var(--color-background)]"
      }
    >
      <div className="container" style={{ perspective: "1000px" }}>
        <img
          src={logo}
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
