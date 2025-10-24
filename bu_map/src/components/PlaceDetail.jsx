import React, { useState } from "react";

export default function PlaceDetail({ openingHours, address, website }) {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="mt-4 bg-white rounded-2xl shadow-inner w-full max-w-md overflow-hidden">
      <div className="flex border-b border-gray-200">
        {["info", "review", "photo"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab === "info" && "정보"}
            {tab === "review" && "리뷰"}
            {tab === "photo" && "사진"}
          </button>
        ))}
      </div>

      <div className="p-4 text-sm text-gray-700 space-y-2">
        {activeTab === "info" && (
          <>
            {openingHours && <p>🕒 운영시간: {openingHours}</p>}
            {address && <p>📍 주소: {address}</p>}
            {website && (
              <p className="text-blue-600">
                🌐{" "}
                <a href={website} target="_blank" rel="noreferrer">
                  {website}
                </a>
              </p>
            )}
          </>
        )}

        {activeTab === "review" && (
          <div className="text-gray-500 italic">추가 필요</div>
        )}

        {activeTab === "photo" && (
          <div className="text-gray-500 italic">추가 필요</div>
        )}
      </div>
    </div>
  );
}
