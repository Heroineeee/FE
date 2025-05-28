import Icon from '@/assets/icons';
import { useState } from 'react';
import BusinessHours from './BusinessHours';
import MainTag from '../StoreReview/MainTag';
import RequestEditButton from './RequestEditButton';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';
import dayjs from 'dayjs';
import LoginRequiredBottomSheet from '../common/LoginRequiredBottomSheet';
import axios from '@/api/axiosInstance';
import type { StoreDetail } from '@/types/store';

interface StoreDetailInfoProps {
  store: StoreDetail;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  favoriteCount: number;
  setLikeCount: (count: number) => void;
}

const StoreDetailInfo: React.FC<StoreDetailInfoProps> = ({
  store,
  isLiked,
  setIsLiked,
  favoriteCount,
  setLikeCount,
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const {
    storeId,
    storeName,
    storeCategory,
    storeAddress,
    representativeTag,
    storeWeeklyOpeningHours,
    storeUpdatedDate,
  } = store;

  const handleLikeClick = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsBottomSheetOpen(true);
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
        setIsLiked(response.data.results.isScrapped);
        setLikeCount(response.data.results.scrapCount);
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
          <p className="text-xs font-medium text-[#919191]">{storeCategory}</p>
          <div className="relative flex items-center gap-[8px]">
            <h1 className="text-[20px] font-semibold text-black leading-[32px]">
              {storeName}
            </h1>
            {representativeTag && <MainTag text={representativeTag} />}
          </div>
        </div>

        <p className="text-xs font-medium text-[#919191]">{storeAddress}</p>

        {/* 영업시간 + 찜 */}
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-[12px] self-stretch">
            <BusinessHours weekly={storeWeeklyOpeningHours ?? undefined} />
          </div>
          <div className="flex justify-end items-center gap-[8px]">
            <button onClick={handleLikeClick} className="cursor-pointer">
              <Icon name={isLiked ? 'heart-filled' : 'heart'} />
            </button>
            <span
              className={`text-base font-semibold tracking-[0.012px] leading-tight ${
                isLiked ? 'text-main-color' : 'text-[#C3C3C3]'
              }`}
            >
              {favoriteCount}
            </span>
          </div>
        </div>

        {/* 수정요청 + 업데이트일 */}
        <div className="flex gap-[8px] items-end">
          <RequestEditButton
            storeId={storeId}
            storeInfo={{
              name: storeName,
              category: storeCategory,
              mapComponent: <StoreDetailMap store={store} />,
            }}
          />
          <p className="text-xs font-medium text-[#C3C3C3]">
            업데이트 {dayjs(storeUpdatedDate).format('YYYY.MM.DD')}
          </p>
        </div>
      </div>

      <LoginRequiredBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      />
    </div>
  );
};

export default StoreDetailInfo;
