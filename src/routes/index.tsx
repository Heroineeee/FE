import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { GpsProvider } from '@/contexts/GpsContext';

const Home = lazy(() => import('../pages/home/HomePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const CallbackPage = lazy(() => import('@/pages/auth/CallbackPage'));
const NicknamePage = lazy(() => import('@/pages/auth/NicknamePage'));
const NicknamePageXXX = lazy(() => import('@/pages/auth/NicknamePageXXX'));
const MyNeighborhoodPage = lazy(() => import('@/pages/auth/MyNeighborhoodPage'));

const StoreMapPage = lazy(() => import('@/pages/store-map/StoreMapPage'));
const DemoMapPage = lazy(() => import('@/pages/demo/DemoMapPage'));
const DemoUnavailablePage = lazy(() => import('@/pages/demo/DemoUnavailablePage'));
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
const StoreSearchPage = lazy(() => import('@/pages/store-search/StoreSearchPage'));
const StoreReviewPage = lazy(() => import('@/pages/store-review/StoreReviewPage'));
const StoreDetailPage = lazy(() => import('@/pages/store-detail/StoreDetailPage'));
const MyPage = lazy(() => import('@/pages/mypage/MyPage'));
const ConvenienceStorePage = lazy(() => import('@/pages/convenience/ConveniencePage'));
const AddConveniencePage = lazy(() => import('@/pages/convenience/AddConveniencePage'));
const ConvenienceDetailPage = lazy(() => import('@/pages/convenience/ConvenienceDetailPage'));
const NameRecommendationPage = lazy(() => import('@/pages/convenience/NameRecommendationPage'));
const AccountDeletePage = lazy(() => import('@/pages/mypage/AccountDeletePage'));
const NicknameEditPage = lazy(() => import('@/pages/mypage/NicknameEditPage'));
const CommunityPage = lazy(() => import('@/pages/community/CommunityPage'));
const CommunityWritePage = lazy(() => import('@/pages/community/CommunityWritePage'));
const CommunitySearchPage = lazy(() => import('@/pages/community/CommunitySearchPage'));

const FeedbackPage = lazy(() => import('@/pages/mypage/FeedbackPage'));
const MyPostsPage = lazy(() => import('@/pages/mypage/MyPostsPage'));
const MyReviewsPage = lazy(() => import('@/pages/mypage/MyReviewsPage'));
const MyLikesPage = lazy(() => import('@/pages/mypage/MyLikesPage'));
const MyScrapPage = lazy(() => import('@/pages/mypage/MyScrapPage'));
const PostDetailPage = lazy(() => import('@/pages/community/CommunityPostDetailPage'));
const NotificationPage = lazy(() => import('@/pages/notification/NotificationPage'));

const Router = () => {
  return (
    <Suspense fallback={null}>
    <Routes>
      <Route
        path="/"
        element={
          <GpsProvider>
            <Home />
          </GpsProvider>
        }
      />
      {/*로그인,닉네임,마이페이지,자주가는지역*/}
      <Route path="/login" element={isDemo ? <DemoUnavailablePage feature="로그인 및 계정" /> : <LoginPage />} />
      <Route path="/oauth/:provider/callback" element={isDemo ? <DemoUnavailablePage feature="로그인 및 계정" /> : <CallbackPage />} />
      <Route path="/nickname" element={isDemo ? <DemoUnavailablePage feature="로그인 및 계정" /> : <NicknamePage />} />
      <Route path="/nicknameXXX" element={isDemo ? <DemoUnavailablePage feature="로그인 및 계정" /> : <NicknamePageXXX />} />
      <Route path="/my-neighborhood" element={isDemo ? <DemoUnavailablePage feature="마이페이지" /> : <MyNeighborhoodPage />} />
      <Route path="/mypage" element={isDemo ? <DemoUnavailablePage feature="마이페이지" /> : <MyPage />} />
      <Route path="/account-delete" element={isDemo ? <DemoUnavailablePage feature="로그인 및 계정" /> : <AccountDeletePage />} />
      <Route path="/nickname-edit" element={isDemo ? <DemoUnavailablePage feature="로그인 및 계정" /> : <NicknameEditPage />} />
      <Route path="/feedback" element={isDemo ? <DemoUnavailablePage feature="로그인 및 계정" /> : <FeedbackPage />} />
      <Route path="/my-posts" element={isDemo ? <DemoUnavailablePage feature="마이페이지" /> : <MyPostsPage />} />
      <Route path="/my-reviews" element={isDemo ? <DemoUnavailablePage feature="마이페이지" /> : <MyReviewsPage />} />
      <Route path="/my-likes" element={isDemo ? <DemoUnavailablePage feature="마이페이지" /> : <MyLikesPage />} />
      <Route path="/my-scrap" element={isDemo ? <DemoUnavailablePage feature="마이페이지" /> : <MyScrapPage />} />

      {/*가맹점 페이지*/}
      <Route
        path="/store-map"
        element={isDemo ? <DemoMapPage /> : <GpsProvider><StoreMapPage /></GpsProvider>}
      />
      <Route
        path="/store-search"
        element={
          <GpsProvider>
            <StoreSearchPage />
          </GpsProvider>
        }
      />
      <Route path="/store-review/:storeId" element={isDemo ? <DemoUnavailablePage feature="리뷰 작성" /> : <StoreReviewPage />} />
      <Route path="/store/:storeId" element={<StoreDetailPage />} />

      {/*편의점*/}
      <Route path="/convenience" element={isDemo ? <DemoUnavailablePage feature="편의점" /> : <ConvenienceStorePage />} />
      <Route path="/convenience/add" element={isDemo ? <DemoUnavailablePage feature="편의점" /> : <AddConveniencePage />} />

      <Route
        path="/convenience/post/:postId"
        element={isDemo ? <DemoUnavailablePage feature="편의점" /> : <ConvenienceDetailPage />}
      />
      <Route
        path="/convenience/name-recommendation"
        element={isDemo ? <DemoUnavailablePage feature="편의점" /> : <NameRecommendationPage />}
      />

      {/*커뮤니티*/}
      <Route path="/community" element={isDemo ? <DemoUnavailablePage feature="커뮤니티" /> : <CommunityPage />} />
      <Route path="/community/post/:postId" element={isDemo ? <DemoUnavailablePage feature="커뮤니티" /> : <PostDetailPage />} />
      <Route path="/community/write" element={isDemo ? <DemoUnavailablePage feature="커뮤니티" /> : <CommunityWritePage />} />
      <Route path="/community/search" element={isDemo ? <DemoUnavailablePage feature="커뮤니티" /> : <CommunitySearchPage />} />

      {/*알림*/}
      <Route path="/notification" element={isDemo ? <DemoUnavailablePage feature="알림" /> : <NotificationPage />} />
    </Routes>
    </Suspense>
  );
};

export default Router;
