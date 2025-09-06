/**
 * Footer component.
 *
 * - Displays the footer section of the application.
 * - Includes copyright information and a reference to the Noroff API.
 *
 * @returns {JSX.Element} The rendered footer component.
 */

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-[color:var(--color-background)] text-center py-4 mt-10">
      <p className="text-sm">
        <span className="inline-block mr-1">©</span> Copyright Laura Karaliene
      </p>
      <p className="text-sm">2025</p>
      <p className="text-sm">Powered by Noroff API</p>
    </footer>
  );
}
