import HomeTopBar from '@/components/home/HomeTopBar';
import Icons from '@/assets/icons';
import SearchInput from '@/components/common/SearchInput';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CarouselBanner from '@/components/home/CarouselBanner';
import { useGps } from '@/contexts/GpsContext';
import axiosInstance from '@/api/axiosInstance';
import { Store } from '@/types/store';
import { trackSearchStore } from '@/analytics/ga';

const bgColors = ['#F3F5ED', '#F4F6F8', '#F3F5ED'];

function HeaderToCarouselSection() {
  const [inputValue, setInputValue] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState<string | null>(null);
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);

  const { address, requestGps, location: gpsLocation } = useGps();

  const { data: searchStores, isError: isSearchError } = useQuery<Store[]>({
    queryKey: ['storeMapSearch', submittedSearchTerm, gpsLocation],
    queryFn: async () => {
      const params: Record<string, unknown> = { keyword: submittedSearchTerm!, size: 2 };
      if (gpsLocation?.latitude != null && gpsLocation?.longitude != null) {
        params.latitude = gpsLocation.latitude;
        params.longitude = gpsLocation.longitude;
        params.radius = 20000;
      }
      const response = await axiosInstance.get('/api/v1/store/map', { params });
      return response.data.results?.content || [];
    },
    enabled: !!submittedSearchTerm,
    staleTime: 0,
    retry: false,
  });

  const navigateToMapWithTerm = (term: string) => {
    const isAddress = /동$|구$|역$/.test(term);
    if (isAddress) {
      navigate('/store-map', { state: { searchTerm: term } });
    } else {
      navigate('/store-map', {
        state: {
          searchTerm: term,
          center: gpsLocation
            ? { lat: gpsLocation.latitude, lng: gpsLocation.longitude }
            : null,
        },
      });
    }
  };

  useEffect(() => {
    if (isSearchError && submittedSearchTerm !== null) {
      navigateToMapWithTerm(submittedSearchTerm);
      setSubmittedSearchTerm(null);
    }
  }, [isSearchError, submittedSearchTerm]);

  useEffect(() => {
    if (!searchStores || submittedSearchTerm === null) return;
    const uniqueStores = searchStores.filter(
      (store, index, self) => index === self.findIndex((s) => s.id === store.id),
    );
    trackSearchStore(submittedSearchTerm, uniqueStores.length);
    const term = submittedSearchTerm;
    setSubmittedSearchTerm(null);

    setTimeout(() => {
      if (
        uniqueStores.length === 1 &&
        uniqueStores[0].name.toLowerCase().replace(/\s/g, '') === term.toLowerCase().replace(/\s/g, '')
      ) {
        navigate(`/store/${uniqueStores[0].id}`);
      } else {
        navigateToMapWithTerm(term);
      }
    }, 100);
  }, [searchStores, submittedSearchTerm, navigate, gpsLocation]);

  const handleSearch = () => {
    const term = inputValue.trim();
    if (!term) return;
    setSubmittedSearchTerm(term);
  };

  // Swiper 초기화 지연 처리
  useEffect(() => {
    if (swiperRef.current) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => swiperRef.current?.autoplay?.start());
      } else {
        setTimeout(() => swiperRef.current?.autoplay?.start(), 800);
      }
    }
  }, []);

  return (
    <div
      className="transition-colors duration-500 py-[8px] flex flex-col"
      style={{ backgroundColor: bgColors[activeSlide] }}
    >
      <div className="px-[15px]">
        <HomeTopBar address={address} />
      </div>
      <div className="flex gap-[8px] px-[20px] w-full">
        <button onClick={() => requestGps()}>
          <Icons name="gps" />
        </button>

        <SearchInput
          placeholder="가게이름을 검색하세요"
          value={inputValue}
          onChange={setInputValue}
          onSearch={handleSearch}
        />
      </div>

      <CarouselBanner onSlideChange={setActiveSlide} swiperRef={swiperRef} />
    </div>
  );
}

export default HeaderToCarouselSection;
