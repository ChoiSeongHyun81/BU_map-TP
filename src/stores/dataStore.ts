import { create } from "zustand";
import type { BuildingDetail, BuildingSummary, FavoriteItem } from "../types/api";

type DataState = {
  buildings: BuildingSummary[];
  buildingDetail: Record<string, BuildingDetail | undefined>;
  favorites: FavoriteItem[];
  setBuildings: (list: BuildingSummary[]) => void;
  setBuildingDetail: (id: string, detail: BuildingDetail) => void;
  setFavorites: (list: FavoriteItem[]) => void;
  addFavorite: (fav: FavoriteItem) => void;
  removeFavorite: (roomId: FavoriteItem["roomId"]) => void;
};

export const useDataStore = create<DataState>((set, get) => ({
  buildings: [],
  buildingDetail: {},
  favorites: [],
  setBuildings: (list) => set({ buildings: list }),
  setBuildingDetail: (id, detail) =>
    set({ buildingDetail: { ...get().buildingDetail, [id]: detail } }),
  setFavorites: (list) => set({ favorites: list }),
  addFavorite: (fav) => {
    const exists = get().favorites.some((f) => f.roomId === fav.roomId);
    if (exists) return;
    set({ favorites: [...get().favorites, fav] });
  },
  removeFavorite: (roomId) =>
    set({ favorites: get().favorites.filter((f) => f.roomId !== roomId) }),
}));
