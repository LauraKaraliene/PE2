/**
 * Host badge component.
 *
 * - Displays the host's avatar and name.
 * - Falls back to a placeholder image and default name if no host data is provided.
 *
 * @param {object} props - Component props.
 * @param {object} props.owner - The host's data.
 * @param {string} [props.owner.name] - The name of the host.
 * @param {object} [props.owner.avatar] - The host's avatar data.
 * @param {string} [props.owner.avatar.url] - The URL of the host's avatar image.
 * @param {string} [props.className=""] - Additional CSS classes for the component.
 * @returns {JSX.Element|null} The rendered host badge component, or `null` if no host data is provided.
 */

import placeholder from "../../assets/placeholder.png";

export default function HostBadge({ owner, className = "" }) {
  if (!owner) return null;

  const avatarUrl = owner?.avatar?.url || placeholder;
  const name = owner?.name || "Host";

  return (
    <div
      className={`my-8  flex items-center gap-3 bg-[color:var(--color-background)] ${className}`}
    >
      <img
        src={avatarUrl}
        alt={`${name}'s avatar`}
        className="w-10 h-10 rounded-full object-cover border"
        loading="lazy"
      />
      <div>
        <p className="text-xs text-[color:var(--color-neutral)] leading-none">
          Hosted by
        </p>
        <p className="text-sm text-[color:var(--color-primary)] font-medium">
          {name}
        </p>
      </div>
    </div>
  );
}
