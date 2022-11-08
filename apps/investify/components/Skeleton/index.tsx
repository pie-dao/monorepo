export const BoldSubDarkTextSkeleton: React.FC = () => (
  <div role="status" className="max-w-sm animate-pulse">
    <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const BaseSubDarkTextSkeleton: React.FC = () => (
  <div role="status" className="max-w-sm animate-pulse">
    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
  </div>
);

export const BoxLoading: React.FC = () => (
  <div
    role="status"
    className="max-w-sm shadow animate-pulse md:p-2 dark:border-gray-700"
  >
    <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-10 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700"></div>
    <span className="sr-only">Loading...</span>
  </div>
);
