// src/queries/community/usePopularPosts.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

interface Post {
  communityPostId: number;
  title: string;
}

export function usePopularPosts(limit?: number) {
  return useQuery<Post[]>({
    queryKey: ['popularPosts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/v1/community/post/popular');
      return res.data?.results?.communityPostPopularResponses ?? [];
    },
    select: (data) =>
      typeof limit === 'number' ? data.slice(0, limit) : data,
    staleTime: 5 * 60 * 1000,
  });
}