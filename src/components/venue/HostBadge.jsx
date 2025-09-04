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
