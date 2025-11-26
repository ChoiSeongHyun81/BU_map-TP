import { useEffect, useMemo, useState } from "react";
import type { BuildingDetail, FloorSummary, RoomSummary, AvailableRoom } from "../types/api";
import { getAvailableRooms } from "../lib/floorApi";

type PlaceDetailProps = Pick<
  BuildingDetail,
  "openingHours" | "address" | "website" | "floors" | "id" | "description" | "desc"
>;

export default function PlaceDetail({
  openingHours,
  address,
  website,
  floors,
  id,
  description,
  desc,
}: PlaceDetailProps) {
  const [activeTab, setActiveTab] = useState<"info" | "emptyroom" | "review">("info");
  const [selectedFloor, setSelectedFloor] = useState<FloorSummary | null>(null);
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[] | null>(null);
  const [emptyLoading, setEmptyLoading] = useState(false);
  const [emptyError, setEmptyError] = useState<string | null>(null);

  // 기본 층 선택
  useEffect(() => {
    if (floors && floors.length) {
      setSelectedFloor(floors[0]);
    } else {
      setSelectedFloor(null);
    }
  }, [floors]);

  // 빈 강의실 조회
  useEffect(() => {
    if (activeTab !== "emptyroom") return;
    if (!selectedFloor) {
      setAvailableRooms([]);
      return;
    }
    setEmptyLoading(true);
    setEmptyError(null);
    getAvailableRooms(selectedFloor.floorId)
      .then((res) => setAvailableRooms(res))
      .catch((err) => {
        console.error("[PlaceDetail] available rooms fetch failed", err);
        setEmptyError("빈 강의실 정보를 불러오지 못했습니다.");
        setAvailableRooms([]);
      })
      .finally(() => setEmptyLoading(false));
  }, [activeTab, selectedFloor]);

  const floorOptions = useMemo(() => floors ?? [], [floors]);

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
            {description?.trim() && <p>ℹ️ {description.trim()}</p>}
            {!description?.trim() && desc?.trim() && <p>ℹ️ {desc.trim()}</p>}
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
            {!openingHours && !address && !website && (
              <p className="text-gray-500">표시할 정보가 없습니다.</p>
            )}
          </>
        )}
        {activeTab === "emptyroom" && (
          <div className="space-y-3">
            {floorOptions.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">층 선택</span>
                <select
                  value={selectedFloor?.floorId ?? ""}
                  onChange={(e) => {
                    const f = floorOptions.find(
                      (x) => String(x.floorId) === e.target.value
                    );
                    setSelectedFloor(f ?? null);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {floorOptions.map((f) => (
                    <option key={f.floorId} value={f.floorId}>
                      {f.name || `${f.level ?? ""}층` || f.floorId}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {emptyLoading && <div className="text-gray-500">불러오는 중...</div>}
            {emptyError && <div className="text-red-600 text-sm">{emptyError}</div>}
            {!emptyLoading && !emptyError && (
              <>
                {availableRooms?.length ? (
                  <ul className="space-y-1">
                    {availableRooms.map((r) => (
                      <li key={r.roomId} className="text-sm text-gray-800">
                        • {r.name || r.roomId}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500">빈 강의실이 없습니다.</div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "review" && (
          <div className="text-gray-500 italic">추가 필요</div>
        )}

      </div>
    </div>
  );
}
