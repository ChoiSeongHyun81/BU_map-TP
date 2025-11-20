import { useState } from "react";
import type { Building } from "../buildings";

type PlaceDetailProps = Pick<Building, "openingHours" | "address" | "website">;

export default function PlaceDetail({
  openingHours,
  address,
  website,
}: PlaceDetailProps) {
  const [activeTab, setActiveTab] = useState<"info" | "emptyroom" | "review">("info");

  return (
    <div className="mt-4 bg-white rounded-2xl shadow-inner w-full max-w-md overflow-hidden">
      <div className="flex border-b border-gray-200">
        {[
          { key: "info", label: "정보" },
          { key: "emptyroom", label: "빈 강의실" },
          { key: "review", label: "리뷰" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {label}
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
        {activeTab === "emptyroom" && (     //빈 강의실 관련 이곳에 추가
          <div className="text-gray-500 italic">추가 필요</div>
          )}

        {activeTab === "review" && (        //리뷰 기능 관련 이곳에 추가
          <div className="text-gray-500 italic">추가 필요</div>
          )}

      </div>
    </div>
  );
}