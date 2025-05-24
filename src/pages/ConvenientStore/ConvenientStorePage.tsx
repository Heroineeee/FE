import Topbar from '@/components/common/TopBar';

const ConvenientStorePage = () => {
  return (
    <div className=" bg-[#fff5df] flex flex-col gap-[12px] min-h-screen">
      <Topbar title="편의점 구매정보" rightElement />
      <div className="px-4 pt-1 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold">편의점 페이지</h1>
          <p className="mt-4 text-lg">여기는 편의점 구매정보 페이지입니다.</p>
        </div>
      </div>
    </div>
  );
};

export default ConvenientStorePage;
