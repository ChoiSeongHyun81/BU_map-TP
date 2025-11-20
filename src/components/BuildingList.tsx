import { useState } from "react";
import { buildings, type Building } from "../buildings";
import PlaceInfo from "./PlaceInfo";

export default function BuildingList() {
  const [selected, setSelected] = useState<Building | null>(null);

  return (
    <div className="p-4 space-y-4">
      <ul className="space-y-2">
        {buildings.map((b) => (
          <li
            key={b.id}
            onClick={() => setSelected(b)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
          >
            {b.name}
          </li>
        ))}
      </ul>

      {selected && (
        <PlaceInfo
          key={selected.id}
          id={selected.id}
          name={selected.name}
          category={selected.category}
          address={selected.address}
          openingHours={selected.openingHours}
          website={selected.website}
          image={selected.image}
        />
      )}
    </div>
  );
}
