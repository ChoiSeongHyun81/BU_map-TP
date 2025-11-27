import { useState, useEffect } from "react";
import PlaceDetail from "./PlaceDetail";
import type { BuildingDetail } from "../types/api";
import { FaStar } from "react-icons/fa";
import { addFavorite, removeFavorite } from "../lib/favoriteApi";
import { useDataStore } from "../stores/dataStore";

type PlaceInfoProps = Pick<
  BuildingDetail,
  | "id"
  | "name"
  | "category"
  | "address"
  | "openingHours"
  | "website"
  | "image"
  | "floors"
  | "description"
  | "desc"
>;

export default function PlaceInfo({
  id,
  name,
  category,
  address,
  openingHours,
  website,
  image,
  floors,
  description,
  desc,
}: PlaceInfoProps) {
  const storageKey = `favorite_${id}`;
  const { favorites, addFavorite: addFavStore, removeFavorite: removeFavStore } =
    useDataStore();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const inStore = favorites.some((f) => String(f.roomId) === String(id));
    setIsFavorite(saved === "true" || inStore);
  }, [id, favorites]);
  
  //즐겨찾기 토글 관리
  const toggleFavorite = () => {
    if (submitting) return;
    const updated = !isFavorite;
    setSubmitting(true);
    const roomId = id;
    const doToggle = async () => {
      try {
        if (updated) {
          await addFavorite(roomId);
          addFavStore({ roomId });
        } else {
          await removeFavorite(roomId);
          removeFavStore(roomId);
        }
        setIsFavorite(updated);
        localStorage.setItem(storageKey, String(updated)); // InfoWindow 동기화
      } catch (err) {
        console.error("[PlaceInfo] favorite toggle failed", err);
        alert("즐겨찾기 처리에 실패했습니다.");
      } finally {
        setSubmitting(false);
      }
    };
    void doToggle();
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        setIsFavorite(e.newValue === "true");
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [id, storageKey]);

  const displayName = name && name.trim().length ? name : `건물 ${id ?? ""}`;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-md">
      {image && <img src={image} alt={name} className="w-full h-48 object-cover" />}

      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
          {category && <p className="text-sm text-blue-600">{category}</p>}
        </div>

        <FaStar
          onClick={toggleFavorite}
          size={28}
          style={{ color: isFavorite ? "gold" : "#d1d5db" }}
          className={`cursor-pointer transition-colors ${submitting ? "opacity-50" : ""}`}
        />
      </div>

      <PlaceDetail
        key={id}
        openingHours={openingHours}
        address={address}
        website={website}
        floors={floors}
        id={id}
        description={description ?? desc}
      />
    </div>
  );
}
