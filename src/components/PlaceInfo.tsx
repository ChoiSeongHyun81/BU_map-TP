import { useState } from "react";
import { useEffect } from "react";
import PlaceDetail from "./PlaceDetail";
import type { Building } from "../buildings";
import { FaStar } from "react-icons/fa";

type PlaceInfoProps = Pick<
  Building,
  "id" | "name" | "category" | "address" | "openingHours" | "website" | "image"
>;

export default function PlaceInfo({
  id,
  name,
  category,
  address,
  openingHours,
  website,
  image,
}: PlaceInfoProps) {
  const storageKey = `favorite_${id}`;

  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setIsFavorite(saved === "true");
  }, [id]);
  
  //즐겨찾기 토글 관리
  const toggleFavorite = () => {
    const updated = !isFavorite;
    setIsFavorite(updated);
    localStorage.setItem(storageKey, String(updated));
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

  return (
     <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-md">
      {image && <img src={image} alt={name} className="w-full h-48 object-cover" />}

      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          {category && <p className="text-sm text-blue-600">{category}</p>}
        </div>

        <FaStar
          onClick={toggleFavorite}
          size={28}
          style={{ color: isFavorite ? "gold" : "#d1d5db" }}
          className="cursor-pointer transition-colors"
        />
      </div>

      <PlaceDetail
        key={id}
        openingHours={openingHours}
        address={address}
        website={website}
      />
    </div>
  );
}