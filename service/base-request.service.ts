/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

import { apiConfig } from "@/config/env";
import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";

const BASE_URL = apiConfig.baseUrl;

export default class BaseRequest {
  baseUrl: string;
  constructor() {
    this.baseUrl = BASE_URL;
    this.setAuth();
  }

  setAuth() {
    axios.interceptors.request.use(
      (config) => {
        const lang = localStorage.getItem("language") || "en-US";
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        if (accessToken) {
          config.headers["token"] = `${accessToken}`;
        }
        config.headers["lang"] = lang;

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  checkPath(path: string) {
    // check case custom prefixBaseUrl
    if (path.includes("https://")) return path;
    // render url api with base url
    const router = BASE_URL + `${path}`;

    return router;
  }
  async get(path = "", params = {}): Promise<any> {
    try {
      return await axios.get(this.checkPath(path), {
        params: params,
      });
    } catch (error) {
      return error;
    }
  }
  async post(path = "", data = {}): Promise<any> {
    try {
      return await axios.post(this.checkPath(path), data);
    } catch (error) {
      return this._errorHandler(error);
    }
  }
  async put(path = "", data = {}): Promise<any> {
    try {
      return await axios.put(this.checkPath(path), data);
    } catch (error) {
      return this._errorHandler(error);
    }
  }
  async delete(path = "", params = {}): Promise<any> {
    try {
      return await axios.delete(this.checkPath(path), params);
    } catch (error) {
      return this._errorHandler(error);
    }
  }
  async patch(path = "", data = {}): Promise<any> {
    try {
      return await axios.patch(this.checkPath(path), data);
    } catch (error) {
      return this._errorHandler(error);
    }
  }
  async _errorHandler(err: any) {
    console.log(err, "err");
    throw err;
  }
}
