import { MapPinIcon } from "@heroicons/react/24/outline";

export default function VenueLocation({ location }) {
  return (
    <p className="flex items-center gap-1 text-sm text-gray-800 mb-2">
      <MapPinIcon className="w-4 h-4 text-gray-700" />
      {location.city}, {location.country}
    </p>
  );
}
