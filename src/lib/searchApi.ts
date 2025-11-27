import api from "./apiClient";
import type { BuildingDetail } from "../types/api";

export const searchBuildings = async (query: string): Promise<BuildingDetail[]> => {
  const res = await api.get<BuildingDetail[]>("/api/search", { params: { query } });
  return res.data;
};
