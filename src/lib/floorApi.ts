import api from "./apiClient";
import type { AvailableRoom } from "../types/api";

export const getAvailableRooms = async (
  floorId: string | number
): Promise<AvailableRoom[]> => {
  const res = await api.get<AvailableRoom[]>(`/api/floors/${floorId}/available-rooms`);
  return res.data;
};
