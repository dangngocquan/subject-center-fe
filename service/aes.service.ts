import * as CryptoJS from "crypto-js";

import { aesConfig } from "@/config/env";

export const encode = async (data: string) => {
  const key = CryptoJS.enc.Hex.parse(aesConfig.key);
  const iv = CryptoJS.enc.Hex.parse(aesConfig.iv);

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

export const decode = async (hashString: string) => {
  const key = CryptoJS.enc.Hex.parse(aesConfig.key);
  const iv = CryptoJS.enc.Hex.parse(aesConfig.iv);

  const decrypted = CryptoJS.AES.decrypt(hashString, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
