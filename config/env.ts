export type ApiConfig = {
  baseUrl: string;
};

export const apiConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
};

export type GoogleConfig = {
  clientId: string;
};

export const googleConfig: GoogleConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
};

export interface AESConfig {
  key: string;
  iv: string;
}

export const aesConfig: AESConfig = {
  key: process.env.NEXT_PUBLIC_AES_KEY || "",
  iv: process.env.NEXT_PUBLIC_AES_IV || "",
};
