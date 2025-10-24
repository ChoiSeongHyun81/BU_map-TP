import React from "react";
import PlaceInfo from "./components/PlaceInfo";

const places = [
  {
     id: 1,
    name: "백석대학교 본부동",
    category: "학교 건물",
    address: "충남 천안시 동남구 백석대학로 1-11",
    openingHours: "00:00 ~ 00:00",
    website: "https://www.bu.ac.kr",
    // image: " ",
  },
  {
    id: 2,
    name: "백석대학교 진리관",
    category: "학교 건물",
    address: "충남 천안시 동남구 백석대학로 1-1",
    openingHours: "00:00 ~ 00:00",
    website: "https://www.bu.ac.kr",
    // image: " ",
  },
  {
    id: 3,
    name: "백석대학교 본부 cu편의점",
    category: "편의시설",
    address: "본부동 6층",
    openingHours: "00:00 ~ 00:00",
    website: "https://www.bu.ac.kr",
    // image: " ",
  },
  //장소 정보 추가 필요 + 이미지 추가 필요


];

export default function App() {
  const selectedPlace = places[0]; //지도의 핑과 연결 필요

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <PlaceInfo {...selectedPlace} />
    </div>
  );
}