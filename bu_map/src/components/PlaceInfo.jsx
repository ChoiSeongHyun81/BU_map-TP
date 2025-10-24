import React from "react";
import PlaceDetail from "./PlaceDetail";

export default function PlaceInfo({
  name,
  category,
  address,
  openingHours,
  website,
  image,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-md">
      {image && (
        <img src={image} alt={name} className="w-full h-48 object-cover" />
      )}

      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        <p className="text-sm text-blue-600">{category}</p>
      </div>

      {/* 하단 탭형 상세 정보 */}
      <PlaceDetail
        openingHours={openingHours}
        address={address}
        website={website}
      />
    </div>
  );
}
