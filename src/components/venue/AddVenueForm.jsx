import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../utils/http";
import { useNotify } from "../../store/notifications";

export default function AddVenueForm({ onClose, onCreated, onUpdated, venue }) {
  const notify = useNotify((s) => s.push);
  const [busy, setBusy] = useState(false);
  const [bannerMsg, setBannerMsg] = useState({ message: "", type: "" });

  const defaults = useMemo(
    () => ({
      name: venue?.name || "",
      description: venue?.description || "",
      price: venue?.price !== undefined ? venue.price : "",
      maxGuests: venue?.maxGuests !== undefined ? venue.maxGuests : "",
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

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "media" });
  const mediaWatch = watch("media");
  const isEdit = !!venue?.id;

  async function onSubmit(data) {
    if (busy) return;
    setBannerMsg({ message: "", type: "" });

    const price = parseFloat(data.price);
    const maxGuests = parseInt(data.maxGuests, 10);

    if (!data.name?.trim()) {
      setBannerMsg({ message: "Venue name is required", type: "error" });
      return;
    }
    if (!data.description?.trim()) {
      setBannerMsg({ message: "Description is required", type: "error" });
      return;
    }
    if (isNaN(price) || price < 0) {
      setBannerMsg({
        message: "Please enter a valid price (0 or greater)",
        type: "error",
      });
      return;
    }
    if (isNaN(maxGuests) || maxGuests < 1) {
      setBannerMsg({
        message: "Please enter a valid number of max guests (1 or greater)",
        type: "error",
      });
      return;
    }

    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      price,
      maxGuests,
      meta: {
        wifi: !!data.meta?.wifi,
        parking: !!data.meta?.parking,
        breakfast: !!data.meta?.breakfast,
        pets: !!data.meta?.pets,
      },
    };

    const entered = (data.media || []).filter((m) => m?.url?.trim());
    if (entered.length > 0) {
      if (entered.some((m) => !m.alt?.trim())) {
        setBannerMsg({
          message: "Please provide Alt text for each image URL",
          type: "error",
        });
        return;
      }

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

    const loc = {};
    if (data.location.address?.trim())
      loc.address = data.location.address.trim();
    if (data.location.city?.trim()) loc.city = data.location.city.trim();
    if (data.location.country?.trim())
      loc.country = data.location.country.trim();
    if (Object.keys(loc).length > 0) payload.location = loc;

    try {
      setBusy(true);
      const endpoint = isEdit
        ? `/holidaze/venues/${venue.id}`
        : `/holidaze/venues`;
      const method = isEdit ? "PUT" : "POST";

      const result = await apiRequest(endpoint, { method, body: payload });

      if (!result?.data?.id) throw new Error("Unexpected response");

      if (isEdit) {
        notify({ type: "success", message: "Venue updated." });
        onUpdated?.(result.data);
      } else {
        notify({ type: "success", message: "Venue created." });
        onCreated?.(result.data);
        reset();
      }

      // close quickly after success
      setTimeout(onClose, 600);
    } catch (e) {
      console.error("Venue save error:", e);
      notify({
        type: "error",
        message: isEdit ? "Failed to update venue." : "Failed to create venue.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {bannerMsg.message && (
        <div
          className={`text-center py-2 text-sm rounded ${
            bannerMsg.type === "success"
              ? "bg-[color:var(--color-accent)] text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {bannerMsg.message}
        </div>
      )}

      <p className="text-sm text-[color:var(--color-primary)] mb-1">
        Please type in venue name and description:
      </p>
      <input
        type="text"
        placeholder="Name*"
        {...register("name", { required: "Name is required" })}
        className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
      />
      <textarea
        rows={3}
        placeholder="Description*"
        {...register("description", { required: "Description is required" })}
        className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
      />

      <p className="text-sm text-[color:var(--color-primary)] mb-1">
        Set price and capacity:
      </p>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Price (NOK)*"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price must be 0 or greater" },
          })}
          className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
        />
        <input
          type="number"
          min="1"
          placeholder="Max Guests*"
          {...register("maxGuests", {
            required: "Max guests is required",
            min: { value: 1, message: "Must have at least 1 guest" },
          })}
          className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
        />
      </div>

      <p className="text-sm mt-2 text-[color:var(--color-primary)] mb-1">
        Images (optional):
      </p>
      <div className="space-y-3">
        {fields.map((field, idx) => (
          <div key={field.id} className="grid grid-cols-2 gap-3 items-start">
            <input
              type="url"
              placeholder={`Image URL ${idx + 1}`}
              {...register(`media.${idx}.url`)}
              className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image Alt"
                {...register(`media.${idx}.alt`)}
                className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
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
          className="text-xs"
        >
          + Add another image
        </button>
      </div>

      <p className="text-sm mt-2 text-[color:var(--color-primary)] mb-1">
        Amenities:
      </p>
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

      <p className="text-sm mt-2 text-[color:var(--color-primary)] mb-1">
        Location (optional):
      </p>
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Address"
          {...register("location.address")}
          className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm col-span-2"
        />
        <input
          placeholder="City"
          {...register("location.city")}
          className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
        />
        <input
          placeholder="Country"
          {...register("location.country")}
          className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={busy}
      >
        {busy ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            {isEdit ? "Saving…" : "Creating…"}
          </>
        ) : isEdit ? (
          "Save Changes"
        ) : (
          "Create Venue"
        )}
      </button>
    </form>
  );
}
