import { Store } from '@/types/store';
import Icon, { IconName } from '@/assets/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { trackSaveStore } from '@/analytics/ga';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';

interface StoreItemProps {
  store: Store;
}

const StoreItem = ({ store }: StoreItemProps) => {
  const [isLiked, setIsLiked] = useState(store.isScrapped === true);
  const [likeCount, setLikeCount] = useState(store.scrapCount);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLiked(store.isScrapped === true);
    setLikeCount(store.scrapCount);
  }, [store.id, store.name, store.isScrapped, store.scrapCount]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      setIsLiked(!isLiked);
      setLikeCount((count) => Math.max(0, count + (isLiked ? -1 : 1)));
      return;
    } // 클릭 이벤트 전파 방지

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsBottomSheetOpen(true);
      return;
    }

    try {
      const response = await axiosInstance({
        method: isLiked ? 'delete' : 'post',
        url: `/api/v1/store/scrap/${store.id}`,
      });

      if (response.data.isSuccess) {
        const newIsLiked = response.data.results.isScrapped;
        setIsLiked(newIsLiked);
        setLikeCount(response.data.results.scrapCount);
        // 즐겨찾기 이벤트 태깅 (저장할 때만)
        if (newIsLiked) {
          trackSaveStore(store.id);
        }
      }
    } catch (error) {
      console.error('스크랩 처리 중 오류가 발생했습니다:', error);
    }
  };

  const handleStoreClick = () => {
    navigate(`/store/${store.id}`, {
      state: {
        isLiked,
        likeCount,
      },
    });
  };

  const categoryIconMap: Record<string, IconName> = {
    한식: 'korean',
    양식: 'western',
    일식: 'japanese',
    중식: 'chinese',
    치킨: 'chicken',
    분식: 'street-food',
    샤브샤브: 'hotpot',
    아시안: 'asian',
    도시락: 'lunch-box',
    간식: 'snack',
    기타: 'etc',
  };

  return (
    <>
      <div
        className="flex gap-[14px] cursor-pointer h-[115px]"
        onClick={handleStoreClick}
      >
        <div className="flex min-w-[115px] aspect-square p-[20px] justify-center items-center rounded-[12px] border border-[#DFE1E4] bg-[#F6F7F8]">
          <div className="w-full h-full">
            <Icon
              name={categoryIconMap[store.category] || 'etc'}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="relative flex-1 flex flex-col justify-between">
          <div className="flex flex-col items-start gap-[8px]">
            <div className="flex flex-col gap-[4px]">
              <span className="text-main-gray text-[12px] tracking-[0.012px] leading-tight">
                {store.category}
              </span>
              <span className="text-[#212121] text-[16px] font-bold tracking-[0.016px] leading-tight">
                {store.name}
              </span>
              <span className="text-main-gray text-[12px] tracking-[0.012px] leading-tight overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
                {store.address}
              </span>
            </div>

            {store.representativeTag && (
              <div className="flex items-center">
                <span className="rounded-[12px] border-[1px] border-main-color bg-bg-gray px-[11px] py-[3px] text-[12px] text-[#212121] tracking-[0.012px] leading-tight">
                  {store.representativeTag}
                </span>
              </div>
            )}

            <div className="absolute bottom-0 flex items-end justify-between w-full">
              <div className="flex items-center gap-[4px]">
                <Icon name="star" />
                <span className="text-main-gray text-[12px] font-medium tracking-[0.012px] leading-tight">
                  {store.ratingAvg}
                </span>
              </div>

              <div className="flex items-center gap-[8px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 클릭 이벤트 전파 방지
                    handleLikeClick(e);
                  }}
                  className="cursor-pointer"
                >
                  <Icon name={isLiked ? 'heart-filled' : 'heart'} />
                </button>
                <span
                  className={`text-[16px] font-semibold tracking-[0.012px] leading-tight ${
                    isLiked ? 'text-main-color' : 'text-sub-gray'
                  }`}
                >
                  {likeCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginRequiredBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      />
    </>
  );
};

export default StoreItem;
