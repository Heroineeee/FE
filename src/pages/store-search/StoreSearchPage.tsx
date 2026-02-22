import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import Header from '@/components/Header';
import SearchInput from '@/components/common/SearchInput';
import MenuCategoryCarousel from '@/components/StoreSearch/MenuCategoryCarousel';
import Dropdown from '@/components/common/Dropdown';
import StoreList from '@/components/StoreSearch/StoreList';
import NoSearchResults from '@/components/common/NoSearchResults';
import Icons from '@/assets/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGps } from '@/contexts/GpsContext';
import { useGpsFetch } from '@/hooks/useGpsFetch';
import useStoreSearch from '@/hooks/useStoreSearch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { categoryMapping, sortMapping } from '@/constants/storeMapping';
import { Store } from '@/types/store';
import {
  trackSearchStore,
  trackOpenCategory,
  trackFilterSearch,
} from '@/analytics/ga';

const StoreSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  

  const {
    address: gpsAddress,
    location: gpsLocation,
    isLocationReady,
    requestGps,
  } = useGps();

  // 초기화 가드들
  const initDoneRef = useRef(false); // 초기 카테고리 확정 전엔 fetch 막기
  const didInitCategoryRef = useRef(false); // StrictMode 2회 호출 차단

  // UI 표시용 상태
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sort, setSort] = useState('가까운 순');
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [gpsOverride, setGpsOverride] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // 페이징/스크롤 관련 ref (React Query 상태와 동기화)
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 검색 훅
  const {
    inputValue,
    setInputValue,
    searchTerm,
    isLocation,
    coordinates,
    handleSearch,
  } = useStoreSearch();

  // 1) 초기 카테고리 동기 확정 (fromHome → saved → '전체'), StrictMode 가드
  useLayoutEffect(() => {
    if (didInitCategoryRef.current) return; // StrictMode 2회 호출 방지
    didInitCategoryRef.current = true;

    const fromHome = location.state?.selectedCategory as string | undefined;
    const saved = localStorage.getItem('selectedCategory') || undefined;

    const initial = fromHome ?? saved ?? '전체';
    setSelectedCategory(initial);

    if (fromHome) {
      // 일회성으로 state 제거 (두 번째 호출 때 다시 덮어쓰지 않도록)
      navigate(location.pathname, { replace: true, state: {} });
    }

    initDoneRef.current = true; // 초기화 완료 신호
  }, [location.pathname, location.state, navigate]);

  // 2) 초기화 이후에만 최근 선택 카테고리를 저장
  useEffect(() => {
    if (!initDoneRef.current) return;
    localStorage.setItem('selectedCategory', selectedCategory);
    // 카테고리 선택 이벤트 태깅 (초기화 이후에만)
    if (selectedCategory !== '전체') {
      trackOpenCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // 정렬 변경 이벤트 태깅
  useEffect(() => {
    if (!initDoneRef.current) return;
    trackFilterSearch('sort', sort);
  }, [sort]);

  // 3) 리스트 요청 파라미터 생성 함수
  const buildRequestParams = useCallback(
    (page: number) => {
      const requestParams: any = {
        page,
        size: 10,
        sort: sortMapping[sort],
      };

      // 기본 category는 현재 상태 기준
      if (selectedCategory !== '전체') {
        requestParams.category = categoryMapping[selectedCategory];
      }

      // GPS 버튼으로 강제 좌표가 설정된 경우
      if (gpsOverride) {
        requestParams.latitude = gpsOverride.latitude;
        requestParams.longitude = gpsOverride.longitude;
      } else {
        // 위치/검색어 기본 로직
        if (searchTerm) {
          if (isLocation && coordinates) {
            requestParams.latitude = coordinates.latitude;
            requestParams.longitude = coordinates.longitude;
          } else {
            requestParams.keyword = searchTerm;
            if (gpsLocation) {
              requestParams.latitude = gpsLocation.latitude;
              requestParams.longitude = gpsLocation.longitude;
            } else {
              requestParams.latitude = null;
              requestParams.longitude = null;
            }
          }
        } else if (isLocation && coordinates) {
          requestParams.latitude = coordinates.latitude;
          requestParams.longitude = coordinates.longitude;
        } else if (gpsLocation) {
          requestParams.latitude = gpsLocation.latitude;
          requestParams.longitude = gpsLocation.longitude;
        } else {
          requestParams.latitude = null;
          requestParams.longitude = null;
        }
      }

      // undefined/null 값은 쿼리에서 제거
      if (requestParams.category == null) delete requestParams.category;

      return requestParams;
    },
    [
      sort,
      selectedCategory,
      gpsOverride,
      searchTerm,
      isLocation,
      coordinates,
      gpsLocation,
    ],
  );

  type StoreListPage = {
    stores: Store[];
    isLastPage: boolean;
  };

  // 4) React Query useInfiniteQuery로 리스트 관리
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<StoreListPage>({
    queryKey: [
      'storeList',
      selectedCategory,
      sort,
      searchTerm,
      isLocation,
      coordinates,
      gpsLocation,
      gpsOverride ? [gpsOverride.latitude, gpsOverride.longitude] : null,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const requestParams = buildRequestParams(pageParam as number);
      try {
        const res = await axiosInstance.get('/api/v1/store/list', {
          params: requestParams,
        });

        const results = res.data.results;
        const newStores = results?.content || [];
        const isLastPage =
          results?.totalPage <= (results?.currentPage ?? 0) + 1;

        // 검색 이벤트 태깅 (첫 페이지일 때만)
        if (pageParam === 0 && searchTerm) {
          trackSearchStore(searchTerm, newStores.length);
        }

        return { stores: newStores, isLastPage };
      } catch (err) {
        console.error('가게 목록 불러오기 실패:', err);
        throw err;
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.isLastPage ? undefined : allPages.length,
    enabled: initDoneRef.current && isLocationReady,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const stores =
    data?.pages.flatMap((page) => page.stores) ?? [];

  // React Query 상태를 무한 스크롤 훅에 맞게 ref로 동기화
  useEffect(() => {
    isLoadingRef.current = isLoading || isFetchingNextPage;
  }, [isLoading, isFetchingNextPage]);

  useEffect(() => {
    hasNextPageRef.current = !!hasNextPage;
  }, [hasNextPage]);

  // 최초 한 번이라도 페치가 완료되었는지 여부
  useEffect(() => {
    if (data) {
      setHasFetchedOnce(true);
    }
  }, [data]);

  // GPS 버튼은 좌표만 진짜로 바꿔야 하니 그대로 override 허용
  const handleGpsClick = useGpsFetch((lat, lng) => {
    setGpsOverride({ latitude: lat, longitude: lng });
  }, requestGps);

  // 무한 스크롤
  const { loaderRef } = useInfiniteScroll({
    onIntersect: () => {
      if (isLocationReady && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    isLoadingRef,
    hasNextPageRef,
    root: null,
    threshold: 0.1,
  });

  // 검색 버튼
  const handleSearchClick = async () => {
    await handleSearch(inputValue, gpsLocation, true);
  };

  const showEmpty = hasFetchedOnce && !isLoading && stores.length === 0;

  return (
    <div className="real-vh">
      <div className="flex flex-col items-center w-full shadow-bottom shrink-0">
        <Header title="가맹점 찾기" location={gpsAddress} />
        <div className="flex gap-[12px] px-[20px] w-full">
          <button onClick={handleGpsClick}>
            <Icons name="gps" />
          </button>
          <SearchInput
            placeholder="가게이름을 검색하세요"
            value={inputValue}
            onChange={setInputValue}
            onSearch={handleSearchClick}
          />
        </div>
        <MenuCategoryCarousel
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            if (category !== '전체') {
              trackOpenCategory(category);
            }
          }}
        />
      </div>

      

      {showEmpty ? (
        <div className="flex items-center justify-center h-[calc(var(--vh,1vh)*100-240px)]">
          {searchTerm && !isLocation ? (
            <NoSearchResults type="search" query={searchTerm} />
          ) : (
            <NoSearchResults type="nearby" />
          )}
        </div>
      ) : (
        <div className="pt-[20px] px-[16px]">
          <div className="flex justify-end pb-[20px]">
            <Dropdown
              options={[
                '가까운 순',
                '리뷰 많은 순',
                '별점 높은 순',
                '조회수 순',
              ]}
              onSelect={(value) => {
                setSort(value);
                trackFilterSearch('sort', value);
              }}
            />
          </div>
          <div
            className="h-[calc(var(--vh,1vh)*100-310px)] overflow-y-auto scrollbar-hide"
            ref={scrollContainerRef}
          >
            <StoreList stores={stores} />
            <div ref={loaderRef} style={{ height: '20px' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSearchPage;
