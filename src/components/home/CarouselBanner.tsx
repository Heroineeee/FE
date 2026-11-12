// CarouselBanner.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useEffect, useState } from 'react';
import CongG from '@/assets/svgs/logo/congG.svg';
import CongG3D from '@/assets/svgs/common/3DCongG.svg';
import { useNavigate } from 'react-router-dom';
import { getRegionCount } from '@/api/store';

interface CarouselBannerProps {
  onSlideChange: (index: number) => void;
  swiperRef: React.MutableRefObject<any>;
  onOpenRegionBottomSheet: () => void;
}

export default function CarouselBanner({
  onSlideChange,
  swiperRef,
  onOpenRegionBottomSheet,
}: CarouselBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [regionCount, setRegionCount] = useState<number>(0);
  const navigate = useNavigate();

  // ✅ CongG3D 미리 로드 (Safari object 로딩 지연 방지)
  useEffect(() => {
    const preload = new Image();
    preload.src = CongG3D;
  }, []);

  // region-count 조회
  useEffect(() => {
    const fetchRegionCount = async () => {
      try {
        const count = await getRegionCount();
        setRegionCount(count);
      } catch (e) {
        console.error('region count 조회 실패:', e);
      }
    };
    fetchRegionCount();
  }, []);

  const slides = [
    // 첫 번째 슬라이드
    {
      content: (
        <div className="flex justify-between px-[20px] items-center">
          <div className="h-full text-title-sb-button font-semibold leading-[20px] flex flex-col gap-[4px] justify-center">
            <p className="text-sub-color">아동급식카드</p>
            <p className="text-black">사용 가맹점을 검색하고,</p>
            <p className="text-black">리뷰를 남겨보세요!</p>
          </div>
          <object data={CongG} type="image/svg+xml" className="w-[122px]" />
        </div>
      ),
    },

    // 두 번째 슬라이드
    {
      content: (
        <div className="pl-[16px] font-semibold text-title-sb-button flex flex-col gap-[12px] justify-center align-self-stretch">
          {import.meta.env.VITE_DEMO_MODE === 'true' ? (
            <div className="text-text-gray flex flex-col leading-[20px]">
              <span>포트폴리오용 <span className="text-sub-color">가맹점 시연 버전</span>입니다.</span>
              <span>예시 가맹점 검색과 상세 조회를 체험해 보세요.</span>
            </div>
          ) : (
            <div className="text-text-gray flex flex-col leading-[20px]">
              <span>
                현재는{' '}
                <span className="text-sub-color">
                  서울, 인천 외 {regionCount}개 지역
                </span>
                만 제공되며,{' '}
              </span>
              <span>다른 지역은 요청이 많은 순으로 추가될 예정이에요.</span>
            </div>
          )}

          <button
            className="px-[16px] w-[113px] h-[28px] bg-main-color text-white rounded-[12px] text-body-md-title font-regular items-center flex gap-[8px]"
            onClick={import.meta.env.VITE_DEMO_MODE === 'true' ? () => navigate('/store-search') : onOpenRegionBottomSheet}
          >
            {import.meta.env.VITE_DEMO_MODE === 'true' ? '가맹점 둘러보기' : '전체 지역 보기'}
          </button>
        </div>
      ),
    },

    // 세 번째 슬라이드 (인스타그램)
    {
      content: (
        <div className="flex justify-between items-center px-[17px] h-[128px]">
          {/* 왼쪽 텍스트 블록 */}
          <div className="font-semibold text-title-sb-button flex flex-col gap-[12px] justify-center">
            <div className="text-text-gray flex flex-col leading-[22px]">
              <span>
                끼니콩의{' '}
                <span className="text-sub-color">공식 인스타그램</span>도{' '}
              </span>
              <span>확인해보세요!</span>
            </div>

            <a
              href="https://www.instagram.com/official_kkinicong/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-[16px] w-auto h-[28px] bg-main-color text-white rounded-[12px] text-body-md-title font-regular flex items-center justify-center gap-[8px]">
                인스타그램 구경하기
              </button>
            </a>
          </div>

          {/* 오른쪽 이미지 */}
          <object
            data={CongG3D}
            type="image/svg+xml"
            className="w-[128px] "
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        onSlideChange={(swiper) => {
          const i = swiper.realIndex;
          setActiveIndex(i);
          onSlideChange(i);
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full h-[128px]"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>

            <div className={`w-full h-[128px] ${idx === 2 ? '' : 'py-[16px]'}`}>
              {slide.content}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 페이지 인디케이터 */}
      <div className="flex gap-[4px] mt">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-[8px] h-[8px] rounded-full transition-colors duration-300 ${
              i === activeIndex ? 'bg-main-gray' : 'bg-sub-gray'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
