import placeholderBanner from "../../assets/placeholder.png";
import placeholderAvatar from "../../assets/placeholder.png";

export default function ProfileInfo({ profile }) {
  const bannerUrl = profile?.banner?.url || placeholderBanner;
  const avatarUrl = profile?.avatar?.url || placeholderAvatar;

  return (
    <div className="relative mb-8">
      {/* Banner */}
      <img
        src={bannerUrl}
        alt={profile.banner?.alt || "User banner"}
        className="w-full h-48 object-cover rounded-lg"
      />

      {/* Avatar + Info */}
      <div className="flex items-center gap-6 absolute left-6 -bottom-12 bg-white p-4 rounded-lg shadow-lg">
        <img
          src={avatarUrl}
          alt={profile.avatar?.alt || "User avatar"}
          className="w-24 h-24 rounded-full object-cover border-4 border-white"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-600">{profile.email}</p>
        </div>
      </div>
    </div>
  );
}
