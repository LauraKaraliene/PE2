export default function VenueDescription({ description }) {
  return (
    <>
      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-7">
        Description
      </h3>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
    </>
  );
}
