import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import type { Post } from '@/components/Community/PostItem';

const categoryMap: Record<string, string> = {
  전체: '',
  복지정보: 'WELFARE_INFO',
  잡담해요: 'CHITCHAT',
  '양육/육아': 'PARENTING',
  '문의/도움': 'QUESTION_HELP',
  생활꿀팁: 'LIFE_TIP',
  '칭찬/감사': 'APPRECIATION',
  기타: 'ETC',
};

type CommunityPostPage = {
    content: Post[];
  
    totalPages: number;
    totalElements: number;
  
    last: boolean;
    first: boolean;
    number: number; // 현재 page index 
    size: number;
    numberOfElements: number;
  
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
  };

  export function useCommunityPosts(selectedCategory: string, size = 10) {
    return useInfiniteQuery<CommunityPostPage>({
      queryKey: ['communityPosts', selectedCategory, size],
      initialPageParam: 0,
      queryFn: async ({ pageParam }) => {
        const categoryEnum = categoryMap[selectedCategory];
  
        const params: any = { page: pageParam, size };
        if (categoryEnum) params.category = categoryEnum;
  
        const res = await axiosInstance.get('/api/v1/community/post', { params });
  
        return res.data.results.results as CommunityPostPage;
      },
      getNextPageParam: (lastPage) => {
        return lastPage.last ? undefined : lastPage.number + 1;
      },
      staleTime: 60_000,
      gcTime: 10 * 60_000,
    });
  }