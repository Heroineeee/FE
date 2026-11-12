import { AxiosError, AxiosHeaders } from 'axios';
import type { AxiosAdapter } from 'axios';
import { mockStores } from './stores';
import type { Store, StoreReview, WeeklyHours } from '@/types/store';

const weekdayHours: WeeklyHours = {
  일: null,
  월: ['11:00', '20:00'],
  화: ['11:00', '20:00'],
  수: ['11:00', '20:00'],
  목: ['11:00', '20:00'],
  금: ['11:00', '20:00'],
  토: ['11:00', '20:00'],
};

const sampleReviews: StoreReview[] = [
  {
    reviewId: 1,
    nickname: '시연 사용자',
    reviewDate: '2025.07.10',
    rating: 5,
    tags: ['음식이 맛있어요'],
    content: '서비스 동작을 보여주기 위한 예시 리뷰입니다.',
    imageUrl: null,
    isOwner: false,
    latitude: 37.534,
    longitude: 126.653,
  },
];

const success = (results: unknown) => ({
  isSuccess: true,
  code: 'COMMON200',
  message: '시연용 데이터',
  results,
});

const toDetail = (store: Store) => ({
  storeId: store.id,
  storeName: store.name,
  storeCategory: store.category,
  storeAddress: store.address,
  representativeTag: store.representativeTag,
  storeWeeklyOpeningHours: weekdayHours,
  storeScrapCount: store.scrapCount,
  isScrapped: false,
  storeUpdatedDate: '2025-07-10',
  storeReviewCount: sampleReviews.length,
  storeRating: store.ratingAvg,
  latitude: store.latitude,
  longitude: store.longitude,
});

const filterStores = (params: Record<string, unknown>) => {
  const keyword = String(params.keyword ?? '').replace(/\s+/g, '').toLowerCase();
  const category = String(params.category ?? '').toUpperCase();
  const sort = String(params.sort ?? '').toUpperCase();
  const categoryToName: Record<string, string> = {
    KOREAN: '한식', WESTERN: '양식', JAPANESE: '일식',
    CHINESE: '중식', CHICKEN: '치킨', BUNSIK: '분식',
    SHABU: '샤브샤브', ASIAN: '아시안', LUNCHBOX: '도시락',
    DESSERT: '간식', ETC: '기타',
  };
  const filtered = mockStores.filter((store) => {
    if (category && categoryToName[category] !== store.category) return false;
    if (!keyword) return true;
    return (store.name + store.address + store.category)
      .replace(/\s+/g, '').toLowerCase().includes(keyword);
  });
  if (sort === 'RATING') filtered.sort((a, b) => b.ratingAvg - a.ratingAvg);
  if (sort === 'VIEW_COUNT') filtered.sort((a, b) => b.viewCount - a.viewCount);
  if (sort === 'REVIEW_COUNT') filtered.sort((a, b) => b.ratingAvg - a.ratingAvg);
  return filtered;
};

/**
 * Read-only replacement for the Spring Boot API in explicit demo builds.
 * No request here is sent to AWS, the removed backend, or a real database.
 */
export const demoAdapter: AxiosAdapter = async (config) => {
  const url = new URL(config.url ?? '/', 'https://demo.invalid');
  const path = url.pathname.replace(/\/$/, '') || '/';
  const params: Record<string, unknown> = {
    ...Object.fromEntries(url.searchParams),
    ...((config.params as Record<string, unknown> | undefined) ?? {}),
  };
  const method = (config.method ?? 'get').toLowerCase();
  let data: unknown;

  if (method !== 'get') {
    throw new AxiosError('데모에서는 저장 및 수정 기능을 제공하지 않습니다.', 'ERR_BAD_REQUEST', config);
  }

  const detailMatch = path.match(/^\/api\/v1\/store\/(\d+)$/);
  const reviewMatch = path.match(/^\/api\/v1\/(\d+)\/review$/);

  if (path === '/api/v1/store/top') {
    data = success([...mockStores].sort((a, b) => b.viewCount - a.viewCount));
  } else if (path === '/api/v1/store/list' || path === '/api/v1/store/map') {
    const filtered = filterStores(params);
    const page = Math.max(0, Number(params.page ?? 0) || 0);
    const size = Math.max(1, Number(params.size ?? 10) || 10);
    data = success({
      content: filtered.slice(page * size, (page + 1) * size),
      totalPage: Math.max(1, Math.ceil(filtered.length / size)),
      currentPage: page,
    });
  } else if (path === '/api/v1/store/region-count') {
    data = success({ count: 0 });
  } else if (detailMatch) {
    const store = mockStores.find((item) => item.id === Number(detailMatch[1]));
    if (!store) throw new AxiosError('해당 시연용 가맹점이 없습니다.', 'ERR_BAD_REQUEST', config);
    data = success(toDetail(store));
  } else if (/^\/api\/v1\/store\/\d+\/external-links$/.test(path)) {
    data = success({ menuUrl: '', directionUrlDesktop: '' });
  } else if (reviewMatch) {
    const page = Math.max(0, Number(params.page ?? 0) || 0);
    const reviews = Number(reviewMatch[1]) === 1 ? sampleReviews : [];
    data = success({
      ratingAvg: reviews.length ? 5 : 0,
      reviewCount: reviews.length,
      pageResponse: {
        content: page === 0 ? reviews : [],
        totalPage: 1,
        currentPage: page,
      },
    });
  } else if (path === '/api/v1/user/place') {
    data = success(null);
  } else if (path === '/api/v1/community/post/popular') {
    data = success({ communityPostPopularResponses: [] });
  } else if (path === '/api/v1/convenience/list') {
    data = success({ content: [], totalPage: 1, currentPage: 0 });
  } else {
    throw new AxiosError(
      '시연 버전에서는 제공되지 않는 기능입니다: ' + path,
      'ERR_BAD_REQUEST',
      config,
    );
  }

  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config,
  };
};
