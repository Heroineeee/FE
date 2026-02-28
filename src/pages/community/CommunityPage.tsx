import TopBar from '@/components/common/TopBar';
import { useNavigate } from 'react-router-dom';
import AlarmIcon from '@/assets/icons/system/alarm.svg';
import SearchIcon from '@/assets/icons/system/search-black.svg';
import PopularPosts from '@/components/Community/PopularPosts';
import Dropdown from '@/components/common/Dropdown';
import { useEffect, useMemo, useRef, useState } from 'react';
import PostItem, { Post } from '@/components/Community/PostItem';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import MenuBar from '@/components/common/MenuBar';

import { useCommunityPosts } from '@/hooks/useCommunityPosts';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 메뉴 열림/닫힘 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useCommunityPosts(selectedCategory, 10);

  // pages -> posts flatten
  const posts: Post[] = useMemo(() => {
    return data?.pages.flatMap((p) => p.content) ?? [];
  }, [data]);

  // useInfiniteScroll 훅이 ref 기반이라 동기화
  const isLoadingRef = useRef(false);
  const hasNextPageRef = useRef(true);

  useEffect(() => {
    isLoadingRef.current = isLoading || isFetchingNextPage;
  }, [isLoading, isFetchingNextPage]);

  useEffect(() => {
    hasNextPageRef.current = !!hasNextPage;
  }, [hasNextPage]);

  const { loaderRef } = useInfiniteScroll({
    onIntersect: () => {
      if (!hasNextPageRef.current) return;
      fetchNextPage();
    },
    isLoadingRef,
    hasNextPageRef,
    root: null,
    threshold: 0.2,
  });

  const PostList = ({ posts }: { posts: Post[] }) => {
    return (
      <div className="flex flex-col">
        {posts.map((post) => (
          <PostItem key={post.communityPostId} post={post} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col">
        <TopBar
          title="커뮤니티"
          paddingX="px-[15px]"
          rightType="custom"
          showBackButton={true}
          showHomeButton={true}
          onBack={() => navigate('/')}
          centerTitle={true}
          customRightElement={
            <div className="flex gap-[14px] items-center">
              <img
                src={AlarmIcon}
                onClick={() => navigate('/notification')}
                className="w-[18px] h-[20px] cursor-pointer"
              />
              <img
                src={SearchIcon}
                onClick={() => navigate('/community/search')}
                className="w-[20px] h-[20px] cursor-pointer"
              />
            </div>
          }
        />

        <PopularPosts />

        <div className="flex justify-end pr-[20px]">
          <Dropdown
            options={[
              '전체',
              '복지정보',
              '잡담해요',
              '양육/육아',
              '문의/도움',
              '생활꿀팁',
              '칭찬/감사',
              '기타',
            ]}
            onSelect={(categoryText) => {
              setSelectedCategory(categoryText);
     
            }}
          />
        </div>

        {/* 상태 UI */}
        {isLoading && <div className="px-[20px] py-[10px]">로딩중...</div>}

        {isError && (
          <div className="px-[20px] py-[10px]">
            로딩 실패
            <button className="ml-2 underline" onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        )}

        <PostList posts={posts} />

        {/* sentinel */}
        <div ref={loaderRef} style={{ height: 20 }} />

        {isFetchingNextPage && (
          <div className="px-[20px] py-[10px]">더 불러오는 중...</div>
        )}
      </div>

      <MenuBar isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
};

export default CommunityPage;