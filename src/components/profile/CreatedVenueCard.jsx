// import React from "react";
// import { Link } from "react-router-dom";
// import placeholder from "../../assets/placeholder.png";

// export default function CreatedVenueCard({ venue, onEdit, onDelete }) {
//   if (!venue) return null;

//   const { id, name, price, location, media } = venue;
//   const imageUrl = media?.[0]?.url || placeholder;
//   const imageAlt = media?.[0]?.alt || "Venue image";
//   const city = location?.city || "Unknown city";
//   const country = location?.country || "Unknown country";

//   return (
//     <div className="w-full max-w-[250px] rounded-lg overflow-hidden shadow-md bg-white mb-30">
//       {/* Image */}
//       <div className="relative">
//         <img
//           src={imageUrl}
//           alt={imageAlt}
//           className="w-full h-52 object-cover"
//         />
//       </div>

//       {/* Text */}
//       <div className="p-3 space-y-1">
//         <h3 className="font-semibold text-sm py-2">
//           {city}, {country}
//         </h3>

//         <p className="text-sm text-gray-700 truncate" title={name}>
//           {name}
//         </p>

//         <div className="flex justify-between items-center text-sm font-semibold">
//           <span>
//             {price} NOK{" "}
//             <span className="text-gray-500 font-normal">/night</span>
//           </span>
//         </div>

//         {/* Actions (host-only) */}
//         <div className="flex gap-2 pt-2">
//           <Link
//             to={`/venues/${id}`}
//             className="btn-primary rounded px-3 py-1.5 text-xs"
//           >
//             Open
//           </Link>
//           {onEdit && (
//             <button
//               type="button"
//               onClick={() => onEdit(venue)}
//               className="border rounded px-3 py-1.5 text-xs"
//             >
//               Edit
//             </button>
//           )}
//           {onDelete && (
//             <button
//               type="button"
//               onClick={() => onDelete(id)}
//               className="text-red-600 border border-red-200 rounded px-3 py-1.5 text-xs"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import placeholder from "../../assets/placeholder.png";

export default function CreatedVenueCard({ venue }) {
  if (!venue) return null;

  const { id, name, price, location, media } = venue;
  const imageUrl = media?.[0]?.url || placeholder;
  const imageAlt = media?.[0]?.alt || "Venue image";
  const city = location?.city || "Unknown city";
  const country = location?.country || "Unknown country";

  return (
    <Link to={`/venues/${id}`} className="block mb-30 focus:outline-none">
      <article className="w-full max-w-[250px] rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow focus:ring-2 focus:ring-black/20">
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
