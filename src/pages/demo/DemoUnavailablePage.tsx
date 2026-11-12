import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

interface Props {
  feature: string;
}

export default function DemoUnavailablePage({ feature }: Props) {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-white">
      <Header title={feature} />
      <div className="px-6 pt-24 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3F9EF] text-3xl">🌱</div>
        <h1 className="text-lg font-bold">포트폴리오 시연 안내</h1>
        <p className="mt-4 text-sm leading-6 text-main-gray">
          {feature} 기능은 실제 백엔드 및 계정 정보가 필요해 이 데모에서는 제공하지 않습니다.
          가맹점 검색과 상세 조회 기능을 체험해 주세요.
        </p>
        <button className="mt-8 w-full rounded-xl bg-[#65CE58] px-4 py-3 font-semibold text-white"
          onClick={() => navigate('/store-search')}>가맹점 검색하기</button>
        <button className="mt-3 w-full rounded-xl border border-[#DFE1E4] px-4 py-3"
          onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    </div>
  );
}
