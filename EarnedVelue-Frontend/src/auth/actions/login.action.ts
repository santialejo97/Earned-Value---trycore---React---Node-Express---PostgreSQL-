import { earnedApi } from "@/api/EarnedApi";
import type { AuthLoginResponse } from "../interfaces/AuthResponse.interfaces";

export const loginAction = async (
  email: string,
  password: string,
): Promise<AuthLoginResponse> => {
  try {
    const { data } = await earnedApi.post<AuthLoginResponse>("auth/login", {
      email,
      password,
    });

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
