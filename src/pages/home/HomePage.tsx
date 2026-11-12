import HeaderToCarouselSection from '@/components/home/HeaderToCarouselSection';
import CategorySection from '@/components/home/CategorySection';
import Top8StoreSection from '@/components/home/Top8StoreSection';
import ConvenienceStoreSection from '@/components/home/ConvenienceStoreSection';
import CommunitySection from '@/components/home/CommunitySection';
import QuickActionButtons from '@/components/home/QuickActionButtons';
import { useEffect, useState } from 'react';
import RegionUpdateDialog from '@/components/common/RegionUpdateDialog';

function HomePage() {
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem('hideRegionUpdateDialog');
    if (import.meta.env.VITE_DEMO_MODE !== 'true' && hidden !== 'true') setOpenDialog(true);
  }, []);

  return (
    <>
      {import.meta.env.VITE_DEMO_MODE === 'true' && (
        <div className="bg-[#F3F5ED] px-5 py-2 text-center text-xs text-[#496844]">
          취업 포트폴리오 시연용 · 아래 가맹점과 후기는 예시 데이터입니다.
        </div>
      )}
      <div className="flex flex-col font-pretendard pb-[61px]">
        <HeaderToCarouselSection />
        <QuickActionButtons />

        <div className="flex flex-col gap-[16px]">
          <CategorySection />
          <Top8StoreSection />
          <ConvenienceStoreSection />
          <CommunitySection />
        </div>
      </div>
      <RegionUpdateDialog
        open={openDialog}
        onGoHome={() => setOpenDialog(false)}
        onDontShowAgain={() => {
          localStorage.setItem('hideRegionUpdateDialog', 'true');
          setOpenDialog(false);
        }}
      />
    </>
  );
}

export default HomePage;
