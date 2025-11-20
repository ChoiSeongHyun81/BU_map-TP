import { useParams } from "react-router-dom";
import { buildings } from "../buildings";
import PlaceInfo from "../components/PlaceInfo";

export default function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const building = buildings.find((b) => b.id === id);

  if (!building)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        ❌ 해당 건물을 찾을 수 없습니다.
      </div>
    );

  const place = {
    name: building.name,
    category: building.category || "학교 건물",
    address: building.address || "주소 정보 없음",
    openingHours: building.openingHours || "00:00 ~ 00:00",
    website: building.website || "https://www.bu.ac.kr",
    image: building.image,
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
      />
    </div>
  );
}