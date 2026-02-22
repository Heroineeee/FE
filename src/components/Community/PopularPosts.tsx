
import axiosInstance from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { usePopularPosts } from '@/hooks/usePopularPosts';



const PopularPosts = () => {
  const navigate = useNavigate();

  //  공용 훅 사용 
  const { data: posts = [] } = usePopularPosts();
  const handleClick = (communityPostId: number) => {
    navigate(`/community/post/${communityPostId}`);
  };

  if (posts.length === 0) return null;

  return (
    <div className="px-[20px] py-[12px] flex flex-col gap-[8px]">
      <p className="text-title-sb-button font-bold">이번주 인기글</p>
      <div className="rounded-[4px] border border-main-color h-[39px]">
        <Swiper
          direction="vertical"
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          modules={[Autoplay]}
          slidesPerView={1}
          allowTouchMove={false}
          observer={true}
          observeParents={true}
          style={{ height: '39px' }}
        >
          {posts.map((post, idx) => (
            <SwiperSlide key={post.communityPostId}>
              <div className="h-[39px] w-full flex px-[12px]">
                <button
                  onClick={() => handleClick(post.communityPostId)}
                  className="text-caption-m text-left truncate w-full flex items-center gap-[8px]"
                >
                  <span className="text-sub-color font-semibold">
                    {idx + 1}.
                  </span>
                  <span className="text-main-gray font-regular text-body-md-description">
                    {post.title}
                  </span>
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PopularPosts;
