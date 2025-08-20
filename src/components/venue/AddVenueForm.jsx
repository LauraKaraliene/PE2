// src/components/venues/AddVenueForm.jsx
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { apiRequest } from "../../constants/api";

export default function AddVenueForm({ onClose, onCreated }) {
  const [bannerMsg, setBannerMsg] = useState({ message: "", type: "" });

  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      maxGuests: "",
      meta: { wifi: false, parking: false, breakfast: false, pets: false },
      media: [{ url: "", alt: "" }], // start with one row
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "media" });
  const mediaWatch = watch("media");

  async function onSubmit(data) {
    setBannerMsg({ message: "", type: "" });

    // required
    if (
      !data.name?.trim() ||
      !data.description?.trim() ||
      !data.price ||
      !data.maxGuests
    ) {
      setBannerMsg({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    // prepare payload
    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      maxGuests: Number(data.maxGuests),
      meta: {
        wifi: !!data.meta?.wifi,
        parking: !!data.meta?.parking,
        breakfast: !!data.meta?.breakfast,
        pets: !!data.meta?.pets,
      },
    };

    // collect media (optional)
    const entered = (data.media || []).filter((m) => m?.url?.trim());
    // alt required if url provided
    if (entered.some((m) => !m.alt?.trim())) {
      setBannerMsg({
        message: "Please provide Alt text for each image URL",
        type: "error",
      });
      return;
    }

    if (entered.length) {
      // HEAD-validate all URLs like your EditProfileForm
      try {
        const checks = await Promise.all(
          entered.map((m) =>
            fetch(m.url, { method: "HEAD" })
              .then((res) => res.ok)
              .catch(() => false)
          )
        );
        if (checks.some((ok) => !ok)) {
          setBannerMsg({
            message: "One or more image URLs are invalid or unreachable",
            type: "error",
          });
          return;
        }
        payload.media = entered.map((m) => ({
          url: m.url.trim(),
          alt: m.alt.trim(),
        }));
      } catch {
        setBannerMsg({
          message: "Could not validate image URLs",
          type: "error",
        });
        return;
      }
    }

    try {
      const result = await apiRequest("/holidaze/venues", "POST", payload);
      if (!result?.data?.id) throw new Error("Unexpected response");
      setBannerMsg({ message: "Venue created!", type: "success" });
      onCreated?.(result.data);
      reset();
      setTimeout(onClose, 1000);
    } catch (e) {
      console.error("Venue create error:", e);
      setBannerMsg({ message: "Failed to create venue", type: "error" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {bannerMsg.message && (
        <div
          className={`text-center py-2 text-sm rounded ${
            bannerMsg.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {bannerMsg.message}
        </div>
      )}

      <p className="text-sm mt-6 text-green-900 mb-1">
        Please type in venue name and description:
      </p>
      <input
        type="text"
        placeholder="Name*"
        {...register("name")}
        className="w-full border border-gray-300 p-2 rounded text-sm"
      />
      <textarea
        rows={3}
        placeholder="Description*"
        {...register("description")}
        className="w-full border border-gray-300 p-2 rounded text-sm"
      />

      <p className="text-sm mt-2 text-green-900 mb-1">
        Set price and capacity:
      </p>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min="0"
          placeholder="Price (NOK)*"
          {...register("price")}
          className="w-full border border-gray-300 p-2 rounded text-sm"
        />
        <input
          type="number"
          min="1"
          placeholder="Max Guests*"
          {...register("maxGuests")}
          className="w-full border border-gray-300 p-2 rounded text-sm"
        />
      </div>

      <p className="text-sm mt-2 text-green-900 mb-1">Images (optional):</p>
      <div className="space-y-3">
        {fields.map((field, idx) => (
          <div key={field.id} className="grid grid-cols-2 gap-3 items-start">
            <input
              type="url"
              placeholder={`Image URL ${idx + 1}`}
              {...register(`media.${idx}.url`)}
              className="w-full border border-gray-300 p-2 rounded text-sm"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image Alt"
                {...register(`media.${idx}.alt`)}
                className="w-full border border-gray-300 p-2 rounded text-sm"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="px-3 py-2 text-sm border rounded"
                >
                  −
                </button>
              )}
            </div>

            {/* tiny preview if URL is present */}
            {mediaWatch?.[idx]?.url ? (
              <img
                src={mediaWatch[idx].url}
                alt="preview"
                className="col-span-2 w-full h-24 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ url: "", alt: "" })}
          className="px-3 py-2 text-sm border rounded"
        >
          + Add another image
        </button>
      </div>

      <p className="text-sm mt-2 text-green-900 mb-1">Amenities:</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("meta.wifi")} /> Wi-Fi
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("meta.parking")} /> Parking
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("meta.breakfast")} /> Breakfast
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("meta.pets")} /> Pets
        </label>
      </div>

      <button type="submit" className="btn btn-primary mt-4 w-full">
        Create Venue
      </button>
    </form>
  );
}

// src/components/venues/AddVenueForm.jsx
// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { apiRequest } from "../../constants/api";

// export default function AddVenueForm({ onClose, onCreated }) {
//   const [bannerMsg, setBannerMsg] = useState({ message: "", type: "" });

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       name: "",
//       description: "",
//       price: "",
//       maxGuests: "",
//       imageUrl: "",
//       imageAlt: "",
//       wifi: false,
//       parking: false,
//       breakfast: false,
//       pets: false,
//     },
//   });

//   async function onSubmit(data) {
//     setBannerMsg({ message: "", type: "" });

//     // Required fields (API requires these)
//     if (
//       !data.name?.trim() ||
//       !data.description?.trim() ||
//       !data.price ||
//       !data.maxGuests
//     ) {
//       setBannerMsg({
//         message: "Please fill in all required fields",
//         type: "error",
//       });
//       return;
//     }

//     const payload = {
//       name: data.name.trim(),
//       description: data.description.trim(),
//       price: Number(data.price),
//       maxGuests: Number(data.maxGuests),
//       meta: {
//         wifi: !!data.wifi,
//         parking: !!data.parking,
//         breakfast: !!data.breakfast,
//         pets: !!data.pets,
//       },
//     };

//     // Optional image (validate with HEAD like your EditProfileForm)
//     if (data.imageUrl) {
//       if (!data.imageAlt) {
//         setBannerMsg({
//           message: "Please provide Image Alt text",
//           type: "error",
//         });
//         return;
//       }
//       try {
//         const res = await fetch(data.imageUrl, { method: "HEAD" });
//         if (res.ok) {
//           payload.media = [{ url: data.imageUrl, alt: data.imageAlt }];
//         } else {
//           setBannerMsg({ message: "Invalid image URL", type: "error" });
//           return;
//         }
//       } catch {
//         setBannerMsg({ message: "Cannot access image URL", type: "error" });
//         return;
//       }
//     }

//     try {
//       // Use your helper, consistent with EditProfileForm
//       const result = await apiRequest("/holidaze/venues", "POST", payload);

//       if (!result?.data?.id) {
//         setBannerMsg({
//           message: "Unexpected response from server",
//           type: "error",
//         });
//         return;
//       }

//       setBannerMsg({ message: "Venue created!", type: "success" });
//       onCreated?.(result.data);
//       reset();

//       // close like you do in EditProfileForm
//       setTimeout(onClose, 1000);
//     } catch (error) {
//       console.error("Venue create error:", error);
//       setBannerMsg({ message: "Failed to create venue", type: "error" });
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       {bannerMsg.message && (
//         <div
//           className={`text-center py-2 text-sm rounded ${
//             bannerMsg.type === "success"
//               ? "bg-green-500 text-white"
//               : "bg-red-500 text-white"
//           }`}
//         >
//           {bannerMsg.message}
//         </div>
//       )}

//       <input
//         type="text"
//         placeholder="Name*"
//         {...register("name")}
//         className="w-full border border-gray-300 p-2 rounded text-sm"
//       />

//       <textarea
//         placeholder="Description*"
//         rows={3}
//         {...register("description")}
//         className="w-full border border-gray-300 p-2 rounded text-sm"
//       />

//       <div className="grid grid-cols-2 gap-3">
//         <input
//           type="number"
//           min="0"
//           placeholder="Price (NOK)*"
//           {...register("price")}
//           className="w-full border border-gray-300 p-2 rounded text-sm"
//         />
//         <input
//           type="number"
//           min="1"
//           placeholder="Max Guests*"
//           {...register("maxGuests")}
//           className="w-full border border-gray-300 p-2 rounded text-sm"
//         />
//       </div>

//       <p className="text-sm mt-2 text-green-900 mb-1">
//         Optional image (URL + Alt):
//       </p>
//       <input
//         type="url"
//         placeholder="Image URL"
//         {...register("imageUrl")}
//         className="w-full border border-gray-300 p-2 rounded text-sm"
//       />
//       <input
//         type="text"
//         placeholder="Image Alt"
//         {...register("imageAlt")}
//         className="w-full border border-gray-300 p-2 rounded text-sm"
//       />

//       <p className="text-sm mt-2 text-green-900 mb-1">Amenities:</p>
//       <div className="grid grid-cols-2 gap-2 text-sm">
//         <label className="inline-flex items-center gap-2">
//           <input type="checkbox" {...register("wifi")} /> Wi‑Fi
//         </label>
//         <label className="inline-flex items-center gap-2">
//           <input type="checkbox" {...register("parking")} /> Parking
//         </label>
//         <label className="inline-flex items-center gap-2">
//           <input type="checkbox" {...register("breakfast")} /> Breakfast
//         </label>
//         <label className="inline-flex items-center gap-2">
//           <input type="checkbox" {...register("pets")} /> Pets
//         </label>
//       </div>

//       <button type="submit" className="btn btn-primary mt-4 w-full">
//         Create Venue
//       </button>
//     </form>
//   );
// }
