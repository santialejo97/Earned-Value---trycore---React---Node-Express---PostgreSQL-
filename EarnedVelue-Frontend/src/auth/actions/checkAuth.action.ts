import { earnedApi } from "@/api/EarnedApi";
import type { AuthLoginResponse } from "../interfaces/AuthResponse.interfaces";

export const checkAuthAction = async (): Promise<AuthLoginResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not token found");

  try {
    const { data } = await earnedApi.get<AuthLoginResponse>("auth/validator");
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    localStorage.removeItem("token");
    throw new Error("Token expted or not valid");
  }
};
