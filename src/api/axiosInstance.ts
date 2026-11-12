import axios from 'axios';
import { demoAdapter } from '@/mocks/demoApi';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Demo mode deliberately never accesses a real backend.
  adapter: import.meta.env.VITE_DEMO_MODE === 'true' ? demoAdapter : undefined,
  // withCredentials: true, // refreshToken이 쿠키로 올 경우 사용
});

// if (
//   import.meta.env.MODE === 'development' &&
//   !localStorage.getItem('accessToken')
// ) {
//   console.log('[DEV MODE] Swagger용 accessToken 임시 주입');
//   localStorage.setItem(
//     'accessToken',
//     '발급받은 임시토큰',
//   );
// }

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 401 → 자동으로 /auth/refresh 요청
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(
          // 'api/v1/auth/refresh',
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }, // 쿠키 기반 refreshToken 전송
        );

        const newAccessToken = refreshRes.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // 요청 재시도
      } catch (refreshError) {
        // refresh 실패 시 logout 처리
        console.error(' refresh 실패:', refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // or navigate('/login');
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
