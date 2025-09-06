/**
 * Venue name component.
 *
 * - Displays the name of a venue.
 *
 * @param {object} props - Component props.
 * @param {string} props.name - The name of the venue.
 * @returns {JSX.Element} The rendered venue name component.
 */

export default function VenueName({ name }) {
  return <h1 className="text-2xl font-bold mb-4">{name}</h1>;
}
