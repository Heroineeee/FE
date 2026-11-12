import Icon from '@/assets/icons';
import { useState } from 'react';
import type { WeeklyHours } from '@/types/store';
import BusinessHours from './BusinessHours';
import MainTag from '../StoreReview/MainTag';
import RequestEditButton from './RequestEditButton';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';
import dayjs from 'dayjs';
import LoginRequiredBottomSheet from '../common/LoginRequiredBottomSheet';
import axios from '@/api/axiosInstance';
import type { StoreDetail } from '@/types/store';
import { trackSaveStore } from '@/analytics/ga';

interface StoreDetailInfoProps {
  store: StoreDetail;
  storeId?: number;
  category: string;
  name: string;
  address: string;
  badgeText?: string;
  favoriteCount: number;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  setLikeCount: (count: number) => void;
  weekly?: WeeklyHours;
  updatedDate: string;
}

const StoreDetailInfo: React.FC<StoreDetailInfoProps> = ({
  store,
  storeId,
  category,
  name,
  address,
  badgeText,
  favoriteCount,
  isLiked,
  setIsLiked,
  setLikeCount,
  weekly,
  updatedDate,
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleLikeClick = async () => {
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      setIsLiked(!isLiked);
      setLikeCount(Math.max(0, favoriteCount + (isLiked ? -1 : 1)));
      return;
    }
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setPendingPath(`/store/${storeId}`);
      setIsBottomSheetOpen(true);
      return;
    }

    if (!storeId) {
      console.error('[스크랩 실패] storeId가 undefined입니다.');
      return;
    }

    try {
      const response = await axios({
        method: isLiked ? 'delete' : 'post',
        url: `/api/v1/store/scrap/${storeId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.isSuccess) {
        const newIsLiked = response.data.results.isScrapped;
        setIsLiked(newIsLiked);
        setLikeCount(response.data.results.scrapCount);
        // 즐겨찾기 이벤트 태깅 (저장할 때만)
        if (newIsLiked) {
          trackSaveStore(storeId);
        }
      } else {
        console.error('서버 응답 실패:', response.data.message);
      }
    } catch (error) {
      console.error('스크랩 처리 중 오류 발생:', error);
    }
  };

  return (
    <div className="w-[341px] pb-[16px] flex flex-col gap-[12px] mx-auto">
      <div className="flex flex-col gap-[12px] w-full">
        {/* 카테고리, 이름, 태그 */}
        <div className="flex flex-col gap-[4px]">
          <p className="text-body-md-description font-regular text-main-gray">
            {category}
          </p>
          <div className="relative flex items-center gap-[8px]">
            <h1 className="text-[20px] font-semibold text-black leading-[32px]">
              {name}
            </h1>
            {badgeText && <MainTag text={badgeText} />}
          </div>
        </div>

        {/* 주소 */}
        <p className="text-body-md-description font-regular text-main-gray">
          {address}
        </p>

        {/* 영업시간 + 찜 아이콘 */}
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-[12px] self-stretch">
            <BusinessHours weekly={weekly} />
          </div>
        </div>

        {/* 수정요청 버튼 + 업데이트 날짜 */}
        <div className="flex justify-between">
          <div className="flex gap-[8px] items-end">
            {storeId !== undefined && import.meta.env.VITE_DEMO_MODE !== 'true' && (
              <RequestEditButton
                storeId={storeId}
                storeInfo={{
                  name,
                  category,
                  mapComponent: <StoreDetailMap store={store} />,
                }}
              />
            )}
            <p className="text-body-md-description font-regular text-sub-gray">
              업데이트 {dayjs(updatedDate).format('YYYY.MM.DD')}
            </p>
          </div>

          <div className="flex justify-end items-center gap-[8px]">
            <button onClick={handleLikeClick} className="cursor-pointer">
              <Icon name={isLiked ? 'heart-filled' : 'heart'} />
            </button>
            <span
              className={`text-title-sb-button font-semibold tracking-[0.012px] leading-tight ${
                isLiked ? 'text-main-color' : 'text-sub-gray'
              }`}
            >
              {favoriteCount}
            </span>
          </div>
        </div>
      </div>

      <LoginRequiredBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        pendingPath={pendingPath}
      />
    </div>
  );
};

export default StoreDetailInfo;
