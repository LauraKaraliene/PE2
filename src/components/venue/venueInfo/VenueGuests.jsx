export default function VenueGuests({ maxGuests }) {
  return (
    <div className="flex items-center gap-2 mb-2 text-sm text-gray-800">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372..."
        />
      </svg>
      {maxGuests} guests
    </div>
  );
}
