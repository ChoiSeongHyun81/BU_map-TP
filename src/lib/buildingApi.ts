import api from "./apiClient";
import type {
  BuildingDetail,
  BuildingSummary,
} from "../types/api";

export const getBuildings = async (): Promise<BuildingSummary[]> => {
  const res = await api.get<BuildingSummary[]>("/api/buildings");
  return res.data;
};

export const getBuildingDetail = async (
  buildingId: string
): Promise<BuildingDetail> => {
  const res = await api.get<BuildingDetail>(`/api/buildings/${buildingId}`);
  return res.data;
};
