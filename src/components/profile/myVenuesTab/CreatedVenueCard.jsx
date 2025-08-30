import { Link } from "react-router-dom";
import placeholder from "../../../assets/placeholder.png";

export default function CreatedVenueCard({ venue }) {
  if (!venue) return null;

  const { id, name, price, location, media } = venue;
  const imageUrl = media?.[0]?.url || placeholder;
  const imageAlt = media?.[0]?.alt || "Venue image";
  const city = location?.city || "Unknown city";
  const country = location?.country || "Unknown country";

  return (
    <Link to={`/venues/${id}`} className="block focus:outline-none">
      <article className="w-full h-full rounded-lg overflow-hidden shadow-md relative bg-white flex flex-col">
        {/* Image */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-52 object-cover"
          />
        </div>

        {/* Text */}
        <div className="p-3 space-y-1">
          <h3 className="font-semibold text-sm py-2">
            {city}, {country}
          </h3>

          <p className="text-sm text-gray-700 truncate" title={name}>
            {name}
          </p>

          <div className="text-sm font-semibold">
            {price} NOK{" "}
            <span className="text-gray-500 font-normal">/night</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
