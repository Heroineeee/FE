import { useParams } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';
import StoreDetailInfo from '@/components/StoreDetail/StoreDetailInfo';
import Header from '@/components/Header';
import StoreDetailReview from '@/components/StoreDetail/StoreDetailReview';
import { StoreDetail } from '@/types/store';
import { trackViewStoreDetail, trackScrollDepth } from '@/analytics/ga';
import QueryBoundary from '@/components/common/QueryBoundary';

const StoreDetailPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 리뷰PR 커밋용 주석 열기
  // 가맹점 상세 정보 불러오기 (TanStack Query 사용)
  const {
    data: store,
    isLoading: loading,
    isError: error,
  } = useQuery<StoreDetail & { isScrapped?: boolean | null }>({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/store/${storeId}`);
      const storeData = res.data.results;
      console.log('대표 태그:', storeData.representativeTag);
      return storeData as StoreDetail & { isScrapped?: boolean | null };
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 메모리에 유지
  });

  // store 데이터가 변경될 때 isLiked와 likeCount 업데이트
  useEffect(() => {
    if (store) {
      setIsLiked(store.isScrapped === true);
      setLikeCount(store.storeScrapCount ?? 0);
    }
  }, [store]);

  // 리뷰 작성 후 상세 정보 다시 불러오기
  const handleReviewChange = () => {
    queryClient.invalidateQueries({ queryKey: ['store', storeId] });
  };

  // 상세 페이지 조회 이벤트 태깅
  useEffect(() => {
    if (store) {
      trackViewStoreDetail(
        store.storeId,
        store.storeCategory,
        store.storeAddress?.split(' ').slice(0, 2).join(' ') || undefined,
      );
    }
  }, [store]);

  // 스크롤 깊이 측정
  useEffect(() => {
    if (!store) return;

    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercent = Math.round(
        ((scrollTop + clientHeight) / scrollHeight) * 100,
      );

      // 75% 이상 스크롤했을 때만 이벤트 전송 (한 번만)
      if (scrollPercent >= 75 && maxScrollDepth < 75) {
        maxScrollDepth = 75;
        trackScrollDepth(75);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [store]);

  // 리뷰PR 커밋용 주석 닫기


  return (
    <div className="font-pretendard">
      <Header className="bg-white" />
      <QueryBoundary
        isLoading={loading}
        isError={!!error}
        isEmpty={!store}
        loadingFallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
          </div>
        }
        errorFallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <p>가맹점 정보를 불러오는데 실패했습니다.</p>
          </div>
        }
      >
      {store && (
        <>
          <StoreDetailInfo
            store={store}
            storeId={store.storeId}
            category={store.storeCategory}
            name={store.storeName}
            address={store.storeAddress}
            badgeText={store.representativeTag ?? undefined}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            favoriteCount={likeCount}
            setLikeCount={setLikeCount}
            weekly={store.storeWeeklyOpeningHours ?? undefined}
            updatedDate={store.storeUpdatedDate}
          />

          <StoreDetailMap store={store} />
          <StoreDetailReview store={store} onReviewChange={handleReviewChange} />
        </>
      )}
    </QueryBoundary>
      
    </div>
  );
};

export default StoreDetailPage;
