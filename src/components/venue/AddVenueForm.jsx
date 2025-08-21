import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../constants/api";

export default function AddVenueForm({ onClose, onCreated, onUpdated, venue }) {
  const [bannerMsg, setBannerMsg] = useState({ message: "", type: "" });

  // derive defaults from venue (edit) or empty (create)
  const defaults = useMemo(
    () => ({
      name: venue?.name || "",
      description: venue?.description || "",
      price: venue?.price ?? "",
      maxGuests: venue?.maxGuests ?? "",
      meta: {
        wifi: !!venue?.meta?.wifi,
        parking: !!venue?.meta?.parking,
        breakfast: !!venue?.meta?.breakfast,
        pets: !!venue?.meta?.pets,
      },
      media: venue?.media?.length
        ? venue.media.map((m) => ({ url: m?.url || "", alt: m?.alt || "" }))
        : [{ url: "", alt: "" }],
      location: {
        address: venue?.location?.address || "",
        city: venue?.location?.city || "",
        country: venue?.location?.country || "",
      },
    }),
    [venue]
  );

  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: defaults,
  });

  // when venue changes (open edit modal), load values
  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "media" });
  const mediaWatch = watch("media");
  const isEdit = !!venue?.id;

  async function onSubmit(data) {
    setBannerMsg({ message: "", type: "" });

    // Require these even in edit (prevents wiping accidentally)
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

    // media (optional) + quick HEAD validation
    const entered = (data.media || []).filter((m) => m?.url?.trim());
    if (entered.some((m) => !m.alt?.trim())) {
      setBannerMsg({
        message: "Please provide Alt text for each image URL",
        type: "error",
      });
      return;
    }
    if (entered.length) {
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

    // location (optional)
    const loc = {
      address: data.location.address?.trim() || undefined,
      city: data.location.city?.trim() || undefined,
      country: data.location.country?.trim() || undefined,
    };
    if (Object.values(loc).some((v) => v !== undefined)) payload.location = loc;

    try {
      const endpoint = isEdit
        ? `/holidaze/venues/${venue.id}`
        : `/holidaze/venues`;
      const method = isEdit ? "PUT" : "POST";
      const result = await apiRequest(endpoint, method, payload);
      if (!result?.data?.id) throw new Error("Unexpected response");

      if (isEdit) {
        setBannerMsg({ message: "Venue updated!", type: "success" });
        onUpdated?.(result.data);
      } else {
        setBannerMsg({ message: "Venue created!", type: "success" });
        onCreated?.(result.data);
        reset(); // clear for create flow
      }
      setTimeout(onClose, 800);
    } catch (e) {
      console.error("Venue save error:", e);
      setBannerMsg({
        message: isEdit ? "Failed to update venue" : "Failed to create venue",
        type: "error",
      });
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

      <p className="text-sm mt-2 text-green-900 mb-1">Location (optional):</p>
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Address"
          {...register("location.address")}
          className="w-full border border-gray-300 p-2 rounded text-sm col-span-2"
        />
        <input
          placeholder="City"
          {...register("location.city")}
          className="w-full border border-gray-300 p-2 rounded text-sm"
        />
        <input
          placeholder="Country"
          {...register("location.country")}
          className="w-full border border-gray-300 p-2 rounded text-sm"
        />
      </div>

      <button type="submit" className="btn btn-primary mt-4 w-full">
        {isEdit ? "Save Changes" : "Create Venue"}
      </button>
    </form>
  );
}
