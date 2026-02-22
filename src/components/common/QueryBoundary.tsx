// src/components/common/QueryBoundary.tsx
import React from 'react';

type Props = {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  loadingFallback: React.ReactNode;
  errorFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  children: React.ReactNode;
};

export default function QueryBoundary({
  isLoading,
  isError,
  isEmpty,
  loadingFallback,
  errorFallback,
  emptyFallback,
  children,
}: Props) {
  if (isLoading) return <>{loadingFallback}</>;
  if (isError) return <>{errorFallback ?? <DefaultError />}</>;
  if (isEmpty) return <>{emptyFallback ?? <DefaultEmpty />}</>;
  return <>{children}</>;
}

function DefaultError() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p>데이터를 불러오는데 실패했습니다.</p>
    </div>
  );
}

function DefaultEmpty() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p>데이터가 없습니다.</p>
    </div>
  );
}