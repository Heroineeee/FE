import { Link, useParams } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { useEffect, useState } from 'react';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';
import StoreDetailInfo from '@/components/StoreDetail/StoreDetailInfo';
import Header from '@/components/Header';
import StoreDetailReview from '@/components/StoreDetail/StoreDetailReview';
import { StoreDetail } from '@/types/store';
import { trackViewStoreDetail, trackScrollDepth } from '@/analytics/ga';

const StoreDetailPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 리뷰PR 커밋용 주석 열기
  // 가맹점 상세 정보 불러오기
  const fetchStoreDetail = async () => {
    try {
      const res = await axios.get(`/api/v1/store/${storeId}`);
      const storeData = res.data.results;
      console.log('대표 태그:', storeData.representativeTag);

      setStore(storeData);
      setIsLiked(storeData.isScrapped === true);
      setLikeCount(storeData.storeScrapCount ?? 0);
    } catch (err) {
      console.error('가맹점 정보를 불러오는데 실패했습니다.', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) fetchStoreDetail();
  }, [storeId]);

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

  if (error || !store) return;

  // 리뷰PR 커밋용 주석 닫기

  return (
    <div className="font-pretendard">
      <Header className="bg-white" />
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

      {import.meta.env.VITE_DEMO_MODE === 'true' ? (
        <div className="mx-4 flex h-[224px] flex-col items-center justify-center gap-3 rounded-xl border border-[#CDE6C8] bg-[#F3F9EF] px-4 text-center">
          <p className="text-base font-semibold text-[#496844]">샘플 가맹점 위치</p>
          <p className="text-sm text-main-gray">{store.storeAddress}</p>
          <p className="text-xs text-main-gray">실제 지도 및 영업 정보가 아닌 포트폴리오 시연 데이터입니다.</p>
          <Link to="/store-map" className="rounded-xl bg-[#65CE58] px-4 py-2 text-sm font-semibold text-white">가맹점 위치 개략도 보기</Link>
        </div>
      ) : (
        <StoreDetailMap store={store} />
      )}
      <StoreDetailReview store={store} onReviewChange={fetchStoreDetail} />
    </div>
  );
};

export default StoreDetailPage;
