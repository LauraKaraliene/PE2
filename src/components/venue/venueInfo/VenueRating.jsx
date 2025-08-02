export default function VenueRating({ rating }) {
  return (
    <div className="flex items-center gap-2 mb-4 text-sm text-gray-800">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-yellow-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0..."
        />
      </svg>
      {rating}
    </div>
  );
}
