/*export interface Review {
  id: string;
  userName: string;
  rating: number;
  content: string;
  date: string;
  images?: string[];
  isOwner: boolean;
}

export type Weekday = '일' | '월' | '화' | '수' | '목' | '금' | '토';

export type WeeklyHours = {
  [key in Weekday]: [string, string] | null;
};

export interface Store {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  mainTag: string;
  address: string;
  lat: number; // 위도
  lng: number; // 경도
  rating: number;
  favoriteCount: number;
  businessHours: {
    open: string;
    close: string;
    isOpen: boolean;
    weekly?: WeeklyHours;
  };
  reviews: Review[];
  reviewCount: number;

  status: '영업중' | '영업 종료';
  statusDescription?: string;
}*/
export type Weekday = '일' | '월' | '화' | '수' | '목' | '금' | '토';

export type WeeklyHours = {
  [key in Weekday]: [string, string] | null;
};

export type Store = {
  id: number;
  name: string;
  address: string;
  category: string;
  ratingAvg: number;
  scrapCount: number;
  representativeTag: string | null;
  isScrapped: boolean | null;
  latitude: number; // 위도
  longitude: number; // 경도
};

export type StoreApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  results: {
    content: Store[];
    totalPage: number;
    currentPage: number;
  };
};

export interface StoreDetail {
  storeId: number;
  storeName: string;
  storeCategory: string;
  storeAddress: string;
  representativeTag: string | null;
  storeWeeklyOpeningHours: WeeklyHours | null;
  storeScrapCount: number;
  storeUpdatedDate: string;
  storeReviewCount: number;
  storeRating: number;
  reviews?: StoreReview[];
  reviewCount?: number;
  ratingAvg?: number;
  latitude: number; 
  longitude: number;
}

export interface StoreReview {
  reviewId: number;
  nickname: string | null;
  reviewDate: string;
  rating: number;
  tags: string[];
  content: string;
  imageUrl: string | null;
  isOwner: boolean | null;
  latitude: number;
  longitude: number;
}
