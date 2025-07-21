import React from "react";
import placeholder from "../assets/placeholder.png";
import StarIcon from "../assets/icons/star.svg";
// import FavoriteIcon from "../assets/icons/favorite.svg";
import HeartIcon from "../assets/icons/heart.svg";

export default function VenueCard() {
  return (
    <div className="w-full max-w-[250px] rounded-lg   overflow-hidden shadow-md relative bg-white">
      {/* Image section */}
      <div className="relative">
        <img
          src={placeholder}
          alt="Venue image"
          className="w-full h-52 object-cover"
        ></img>

        {/* Favorite icon */}
        <img
          src={HeartIcon}
          alt="Save to favorites"
          className="absolute top-2 right-2 w-6 h-6 p-1 cursor-pointer"
        ></img>

        {/* Text section */}
        <div className="p-3 space-y-1">
          <h3 className="font-semibold text-sm py-2">City, Country</h3>
          <p className="text-sm text-gray-700">Property Name</p>

          {/* Price and rating row */}
          <div className="flex justify-between items-center text-sm font-semibold">
            <span>
              1500 NOK <span className="text-gray-500 font-normal">/night</span>
            </span>
            <div className="flex items-center gap-1">
              <img src={StarIcon} alt="Star" className="w-4 h-4" />
              <span className="text-sm">4.65</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
