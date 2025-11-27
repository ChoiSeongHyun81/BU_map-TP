import api from "./apiClient";
import type { FavoriteItem } from "../types/api";

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  const res = await api.get<FavoriteItem[]>("/api/favorites");
  return res.data;
};

export const addFavorite = async (roomId: string | number) => {
  await api.post("/api/favorites", { roomId });
};

export const removeFavorite = async (roomId: string | number) => {
  await api.delete("/api/favorites", { params: { roomId } });
};
