import { useGoogleLogin } from "@react-oauth/google";

import { API_ROUTES } from "./api-route.service";
import BaseRequest from "./base-request.service";

import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";

export const useAuthGoogle = (
  onSuccessCallback?: () => void,
  onErrorCallback?: () => void
) => {
  return useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await new BaseRequest().post(API_ROUTES.AUTH_GOOGLE, {
          token: tokenResponse.access_token,
        });
        const token = response?.data?.token;
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
        window.dispatchEvent(new Event("authChange"));
        if (onSuccessCallback) onSuccessCallback();
      } catch (error) {
        console.error("Google login error:", error);
        if (onErrorCallback) onErrorCallback();
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      if (onErrorCallback) onErrorCallback();
    },
  });
};
