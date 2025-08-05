export default function VenueAmenities({ meta }) {
  return (
    <>
      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-7">
        What this place offers
      </h3>
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[color:var(--color-primary)]">
        {/* Wifi */}
        {meta?.wifi && (
          <span className="flex items-center gap-1 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
              />
            </svg>
            Wifi
          </span>
        )}

        {/* Parking */}
        {meta?.parking && (
          <span className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full border border-[color:var(--color-primary)] flex items-center justify-center text-xs text-[color:var(--color-primary)] font-semibold">
              P
            </div>
            Parking
          </span>
        )}

        {/* Breakfast */}
        {meta?.breakfast && (
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 -960 960 960"
              fill="#14532D"
            >
              <path d="M180-475q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180-160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm240 0q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180 160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM266-75q-45 0-75.5-34.5T160-191q0-52 35.5-91t70.5-77q29-31 50-67.5t50-68.5q22-26 51-43t63-17q34 0 63 16t51 42q28 32 49.5 69t50.5 69q35 38 70.5 77t35.5 91q0 47-30.5 81.5T694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z" />
            </svg>
            Breakfast
          </span>
        )}

        {/* Pets */}
        {meta?.pets && (
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 -960 960 960"
              fill="#14532D"
            >
              <path d="M280-80v-366q-51-14-85.5-56T160-600v-280h80v280h40v-280h80v280h40v-280h80v280q0 56-34.5 98T360-446v366h-80Zm400 0v-320H560v-280q0-83 58.5-141.5T760-880v800h-80Z" />
            </svg>
            Pets allowed
          </span>
        )}
      </div>
    </>
  );
}
//   return (
//     <>
//       <h3 className="text-base font-semibold text-gray-800 mb-2 mt-7">
//         What this place offers
//       </h3>
//       <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[color:var(--color-primary)]">
//         {meta?.wifi && (
//           <span className="flex items-center gap-1">[WiFi SVG] Wifi</span>
//         )}
//         {meta?.parking && (
//           <span className="flex items-center gap-1">[P icon] Parking</span>
//         )}
//         {meta?.breakfast && (
//           <span className="flex items-center gap-1">
//             [Breakfast SVG] Breakfast
//           </span>
//         )}
//         {meta?.pets && (
//           <span className="flex items-center gap-1">
//             [Pets SVG] Pets allowed
//           </span>
//         )}
//       </div>
//     </>
//   );
// }
