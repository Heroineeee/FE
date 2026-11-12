import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { mockStores } from '@/mocks/stores';
import type { Store } from '@/types/store';

/** A clearly labeled schematic for the portfolio build; not Kakao Maps. */
export default function DemoMapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState(String(location.state?.searchTerm ?? ''));
  const filtered = useMemo(
    () => mockStores.filter((store) => (
      (store.name + store.address + store.category)
        .replace(/\s/g, '')
        .toLowerCase().includes(keyword.replace(/\s/g, '').toLowerCase())
    )),
    [keyword],
  );
  const latMin = 37.48;
  const latMax = 37.61;
  const lngMin = 126.60;
  const lngMax = 126.72;

  const openStore = (store: Store) => navigate(`/store/${store.id}`);

  return (
    <div className="min-h-full bg-white pb-24">
      <Header title="가맹점 지도" />
      <div className="px-4 py-3">
        <input
          aria-label="샘플 가맹점 검색"
          className="w-full rounded-xl border border-[#DFE1E4] px-4 py-3 text-sm"
          placeholder="가게 이름 또는 카테고리 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <p className="mt-2 text-xs text-main-gray">포트폴리오 데모 · 실제 지도 및 실시간 가맹점 정보가 아닌 예시 위치입니다.</p>
      </div>
      <div className="relative mx-4 h-60 overflow-hidden rounded-2xl border border-[#CDE6C8] bg-[#F3F9EF]">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'linear-gradient(to right, #BFDDBF 1px, transparent 1px), linear-gradient(to bottom, #BFDDBF 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute left-3 top-3 text-xs font-semibold text-[#496844]">샘플 위치 개략도</div>
        {filtered.map((store) => {
          const x = Math.min(88, Math.max(12, ((store.longitude - lngMin) / (lngMax - lngMin)) * 76 + 12));
          const y = Math.min(86, Math.max(18, (1 - (store.latitude - latMin) / (latMax - latMin)) * 68 + 18));
          return (
            <button
              key={store.id}
              aria-label={`${store.name} 상세 보기`}
              title={store.name}
              onClick={() => openStore(store)}
              className="absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#65CE58] text-xs font-bold text-white shadow-md"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {store.id}
            </button>
          );
        })}
      </div>
      <div className="px-4 pt-5">
        <h2 className="mb-3 text-base font-bold">가맹점 {filtered.length}곳</h2>
        <div className="flex flex-col gap-2">
          {filtered.map((store) => (
            <button key={store.id} onClick={() => openStore(store)} className="flex items-center gap-3 rounded-xl border border-[#E7EBE6] p-3 text-left">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F9EF] font-semibold text-[#496844]">{store.id}</span>
              <span className="flex-1">
                <span className="block text-sm font-bold">{store.name}</span>
                <span className="block text-xs text-main-gray">{store.category} · {store.address}</span>
              </span>
              <span className="text-[#496844]">›</span>
            </button>
          ))}
          {filtered.length === 0 && <p className="py-10 text-center text-sm text-main-gray">일치하는 시연용 가맹점이 없어요.</p>}
        </div>
      </div>
    </div>
  );
}
