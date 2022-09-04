import axios from 'axios';
import { RefreshTokensDto } from '../dtos/auth/refresh-tokens.dto';
import { refreshTokens } from '../services/auth.service';

export const publicServer = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authenticatedServer = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

authenticatedServer.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers!['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authenticatedServer.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalConfig = error.config;

    if (error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          // Fetch refresh token from the local storage
          // and prepare dto on it.
          const refreshToken = localStorage.getItem('refreshToken');
          const refreshTokensDto = new RefreshTokensDto(refreshToken!);

          // Refresh the tokens.
          await refreshTokens(refreshTokensDto);

          // Retry request.
          return authenticatedServer(originalConfig);
        } catch (_error) {
          // Reject with error.
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(error);
  }
);

