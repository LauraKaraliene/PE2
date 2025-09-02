import { UsersIcon } from "@heroicons/react/24/outline";

export default function VenueGuests({ maxGuests }) {
  return (
    <div className="flex items-center gap-2 mb-2 text-sm text-gray-800">
      <UsersIcon className="w-4 h-4 text-gray-700" />
      <span>{maxGuests} guests</span>
    </div>
  );
}
