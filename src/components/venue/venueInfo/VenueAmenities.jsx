export default function VenueAmenities({ meta }) {
  return (
    <>
      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-7">
        What this place offers
      </h3>
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[color:var(--color-primary)]">
        {meta?.wifi && (
          <span className="flex items-center gap-1">[WiFi SVG] Wifi</span>
        )}
        {meta?.parking && (
          <span className="flex items-center gap-1">[P icon] Parking</span>
        )}
        {meta?.breakfast && (
          <span className="flex items-center gap-1">
            [Breakfast SVG] Breakfast
          </span>
        )}
        {meta?.pets && (
          <span className="flex items-center gap-1">
            [Pets SVG] Pets allowed
          </span>
        )}
      </div>
    </>
  );
}
