import React, { useState } from 'react';
import TagSelector from '@/components/StoreReview/TagSelector';

const MAX_TOTAL = 5;

const SelectTag: React.FC = () => {
  // 그룹별 선택 상태
  const [menuTags, setMenuTags] = useState<string[]>([]);
  const [spaceTags, setSpaceTags] = useState<string[]>([]);
  const [cardTags, setCardTags] = useState<string[]>([]);
  const [etcTags, setEtcTags] = useState<string[]>([]);

  // 전체 선택된 태그 수 계산
  const getTotalCount = () =>
    menuTags.length + spaceTags.length + cardTags.length + etcTags.length;

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="h-[20px] text-[#919191]">
        <span className="text-black font-semibold leading-[20px] text-base">
          태그를 선택해주세요
        </span>{' '}
        (최대 5개)
      </p>

      <div className="flex flex-col gap-[12px] text-xs font-medium text-[#919191]">
        <p>메뉴가 어땠나요?</p>
        <TagSelector
          tags={['음식이 맛있어요', '재료가 신선해요', '아이들이 먹기 좋아요']}
          selectedTags={menuTags}
          onChange={(updated) => {
            const newTotal = getTotalCount() - menuTags.length + updated.length;
            if (newTotal <= MAX_TOTAL) {
              setMenuTags(updated);
            }
          }}
        />

        <p>공간은 어땠나요?</p>
        <TagSelector
          tags={[
            '혼자 가도 편해요',
            '분위기가 좋아요',
            '이야기하기 좋아요',
            '매장이 청결해요',
            '금방 나와요',
          ]}
          selectedTags={spaceTags}
          onChange={(updated) => {
            const newTotal =
              getTotalCount() - spaceTags.length + updated.length;
            if (newTotal <= MAX_TOTAL) {
              setSpaceTags(updated);
            }
          }}
        />

        <p>급식카드 이용에 불편함은 없었나요?</p>
        <TagSelector
          tags={[
            '직원이 친절해요',
            '결제 거절이 없어요',
            '편하게 먹을 수 있어요',
          ]}
          selectedTags={cardTags}
          onChange={(updated) => {
            const newTotal = getTotalCount() - cardTags.length + updated.length;
            if (newTotal <= MAX_TOTAL) {
              setCardTags(updated);
            }
          }}
        />

        <p>기타</p>
        <TagSelector
          tags={['포장 가능해요', '주차하기 편해요']}
          selectedTags={etcTags}
          onChange={(updated) => {
            const newTotal = getTotalCount() - etcTags.length + updated.length;
            if (newTotal <= MAX_TOTAL) {
              setEtcTags(updated);
            }
          }}
        />
      </div>
    </div>
  );
};

export default SelectTag;
