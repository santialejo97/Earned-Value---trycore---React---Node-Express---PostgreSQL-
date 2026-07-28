import { earnedApi } from "@/api/EarnedApi";
import type { AuthLoginResponse } from "../interfaces/AuthResponse.interfaces";

export const registerAction = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthLoginResponse> => {
  try {
    const { data } = await earnedApi.post<AuthLoginResponse>("auth/register", {
      email,
      password,
      name,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
