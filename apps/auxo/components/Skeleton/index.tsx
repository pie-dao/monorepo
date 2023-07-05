export const BoldSubDarkTextSkeleton: React.FC = () => (
  <div role="status" className="max-w-sm animate-pulse">
    <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-full sm:w-48"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const BaseSubDarkTextSkeleton: React.FC = () => (
  <div role="status" className="max-w-sm animate-pulse">
    <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-full sm:w-32 my-2"></div>
  </div>
);

export const BoxLoading: React.FC = () => (
  <div
    role="status"
    className="max-w-sm shadow animate-pulse md:p-2 dark:border-gray-700"
  >
    <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-full sm:w-10 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
    <span className="sr-only">Loading...</span>
  </div>
);
