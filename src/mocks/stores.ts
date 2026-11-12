import type { Store } from '@/types/store';

/**
 * Portfolio-only fixtures. These are illustrative sample records, NOT live
 * child meal card merchant data. Keep them separate from production API data.
 */
export const mockStores: Store[] = [
  { id: 1, name: '콩쥐 한식당', address: '인천광역시 서구 청라동 (시연용)', category: '한식', ratingAvg: 4.8, scrapCount: 42, representativeTag: '음식이 맛있어요', isScrapped: false, latitude: 37.534, longitude: 126.653, viewCount: 1402 },
  { id: 2, name: '끼니 분식', address: '인천광역시 서구 가정동 (시연용)', category: '분식', ratingAvg: 4.6, scrapCount: 28, representativeTag: '가격이 합리적이에요', isScrapped: false, latitude: 37.529, longitude: 126.672, viewCount: 1034 },
  { id: 3, name: '초록 스시', address: '인천광역시 서구 청라동 (시연용)', category: '일식', ratingAvg: 4.7, scrapCount: 35, representativeTag: '재료가 신선해요', isScrapped: false, latitude: 37.533, longitude: 126.637, viewCount: 986 },
  { id: 4, name: '오늘의 도시락', address: '인천광역시 서구 가정동 (시연용)', category: '도시락', ratingAvg: 4.5, scrapCount: 16, representativeTag: '양이 푸짐해요', isScrapped: false, latitude: 37.527, longitude: 126.669, viewCount: 870 },
  { id: 5, name: '바삭 치킨', address: '인천광역시 서구 검단동 (시연용)', category: '치킨', ratingAvg: 4.4, scrapCount: 22, representativeTag: '친절해요', isScrapped: false, latitude: 37.596, longitude: 126.641, viewCount: 744 },
  { id: 6, name: '온기 샤브', address: '인천광역시 서구 청라동 (시연용)', category: '샤브샤브', ratingAvg: 4.9, scrapCount: 31, representativeTag: '음식이 맛있어요', isScrapped: false, latitude: 37.532, longitude: 126.636, viewCount: 1210 },
  { id: 7, name: '작은 파스타', address: '인천광역시 서구 가정동 (시연용)', category: '양식', ratingAvg: 4.3, scrapCount: 14, representativeTag: '분위기가 좋아요', isScrapped: false, latitude: 37.529, longitude: 126.670, viewCount: 653 },
];
