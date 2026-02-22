
import { useNavigate } from 'react-router-dom';
import Forward from '@/assets/icons/system/forward.svg';
import Icon from '@/assets/icons';
import { usePopularPosts } from '@/hooks/usePopularPosts';


function CommunitySection() {
  const navigate = useNavigate();
  
  const handleClick = () => {
  navigate('/community');
};


  const {
    data: posts = [],
    isLoading,
    isError,
  } = usePopularPosts(3);

  return (
    <div className="px-[20px] pb-[24px] flex flex-col gap-[20px]">
      <button className="flex flex-col gap-[8px]" onClick={handleClick}>
        <Icon name="community" />
        <p className="text-black text-title-sb-button font-semibold text-left">
          <span>커뮤니티에서 다양한 이야기를 나눠보세요!</span>
        </p>
      </button>

      <div className="py-[16px] pl-[20px] pr-[19px] rounded-[10px] flex flex-col gap-[20px] shadow-custom min-h-[160px]">
        <div className="flex justify-between">
          <span className="text-title-sb-button font-semibold text-[#212121]">
            오늘의 인기글
          </span>

          <button
            className="text-main-gray text-body-md-description flex gap-[8px] items-center"
            onClick={handleClick}
          >
            <span>확인하러 가기</span>
            <img src={Forward} className="w-[7px]" />
          </button>
        </div>

        {/* 로딩 처리 */}
        {isLoading && (
          <div className="text-main-gray text-body-md-description">
            불러오는 중...
          </div>
        )}

        {/* 에러 처리 */}
        {isError && (
          <div className="text-main-gray text-body-md-description">
            인기글을 불러오지 못했습니다.
          </div>
        )}

        {/* 데이터 */}
        {!isLoading && !isError && (
          <ul className="flex flex-col gap-[14px]">
            {posts.map((post) => (
              <li
                key={post.communityPostId}
                onClick={() =>
                  navigate(`/community/post/${post.communityPostId}`)
                }
                className="flex justify-between h-[18px] items-center cursor-pointer text-body-md-title text-black"
              >
                <span className="truncate">{post.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

}

export default CommunitySection;
