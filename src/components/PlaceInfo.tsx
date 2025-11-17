import PlaceDetail from "./PlaceDetail";
import type { Building } from "../buildings";

type PlaceInfoProps = Pick<
  Building,
  "name" | "category" | "address" | "openingHours" | "website" | "image"
>;

export default function PlaceInfo({
  name,
  category,
  address,
  openingHours,
  website,
  image,
}: PlaceInfoProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-md">
      {image && <img src={image} alt={name} className="w-full h-48 object-cover" />}

      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        {category && <p className="text-sm text-blue-600">{category}</p>}
      </div>

      <PlaceDetail openingHours={openingHours} address={address} website={website} />
    </div>
  );
}