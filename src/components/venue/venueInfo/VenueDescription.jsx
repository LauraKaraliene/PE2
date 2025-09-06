/**
 * Venue description component.
 *
 * - Displays the description of a venue.
 *
 * @param {object} props - Component props.
 * @param {string} props.description - The description text of the venue.
 * @returns {JSX.Element} The rendered venue description component.
 */

export default function VenueDescription({ description }) {
  return (
    <>
      <h3 className="text-base font-heading font-semibold text-[color:var(--color-neutral)] mb-2 mt-7">
        Description
      </h3>
      <p className="text-[color:var(--color-neutral)] text-sm leading-relaxed">
        {description}
      </p>
    </>
  );
}
