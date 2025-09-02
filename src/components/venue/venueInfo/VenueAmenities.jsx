import { FaWifi, FaParking, FaUtensils, FaPaw } from "react-icons/fa";

export default function VenueAmenities({ meta }) {
  return (
    <>
      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-7">
        What this place offers
      </h3>

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[color:var(--color-primary)]">
        {/* Wifi */}
        {meta?.wifi && (
          <li className="inline-flex items-center gap-1 leading-none">
            <FaWifi size={16} className="shrink-0" aria-hidden />
            <span className="leading-none">Wifi</span>
          </li>
        )}

        {/* Parking */}
        {meta?.parking && (
          <li className="inline-flex items-center gap-1 leading-none">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-current text-[10px] font-semibold shrink-0">
              P
            </span>
            <span className="leading-none">Parking</span>
          </li>
        )}

        {/* Breakfast */}
        {meta?.breakfast && (
          <li className="inline-flex items-center gap-1 leading-none">
            <FaUtensils size={16} className="shrink-0" aria-hidden />
            <span className="leading-none">Breakfast</span>
          </li>
        )}

        {/* Pets */}
        {meta?.pets && (
          <li className="inline-flex items-center gap-1 leading-none">
            <FaPaw size={16} className="shrink-0" aria-hidden />
            <span className="leading-none">Pets allowed</span>
          </li>
        )}
      </ul>
    </>
  );
}
