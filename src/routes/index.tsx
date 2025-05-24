import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/HomePage';

import LoginPage from '@/pages/auth/LoginPage';
import CallbackPage from '@/pages/auth/CallbackPage';
import NicknamePage from '@/pages/auth/NicknamePage';
import NicknamePageXXX from '@/pages/auth/NicknamePageXXX';

import StoreSearchPage from '@/pages/StoreSearch/StoreSearchPage';
import StoreReviewPage from '@/pages/StoreReview/StoreReviewPage';
import StoreDetailPage from '@/pages/StoreDetail/StoreDetailPage';
import ConvenientStorePage from '@/pages/ConvenientStore/ConvenientStorePage';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth/:provider/callback" element={<CallbackPage />} />
      <Route path="/nickname" element={<NicknamePage />} />
      <Route path="/nicknameXXX" element={<NicknamePageXXX />} />
      <Route path="/store-search" element={<StoreSearchPage />} />
      <Route path="/store-review/:storeId" element={<StoreReviewPage />} />
      <Route path="/store/:storeId" element={<StoreDetailPage />} />
      <Route path="/convenient-store" element={<ConvenientStorePage />} />
    </Routes>
  );
};

export default Router;
