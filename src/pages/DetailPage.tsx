import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceInfo from "../components/PlaceInfo";
import { getBuildingDetail } from "../lib/buildingApi";
import type { BuildingDetail } from "../types/api";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [building, setBuilding] = useState<BuildingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("잘못된 경로입니다.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    getBuildingDetail(id)
      .then((data) => setBuilding({ ...data, id: data.buildingId || data.id || id }))
      .catch(() => setError("해당 건물을 찾을 수 없습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        로딩 중...
      </div>
    );

  if (error || !building)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        ❌ {error || "해당 건물을 찾을 수 없습니다."}
      </div>
    );

  const place = {
    name: building.name,
    category: building.category || "학교 건물",
    address: building.address || "주소 정보 없음",
    openingHours: building.openingHours || "00:00 ~ 00:00",
    website: building.website || "https://www.bu.ac.kr",
    image: building.image,
    floors: building.floors,
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <PlaceInfo
        id={building.id}
        name={building.name}
        category={building.category}
        address={building.address}
        openingHours={building.openingHours}
        website={building.website}
        image={building.image}
        floors={building.floors}
      />
    </div>
  );
}
