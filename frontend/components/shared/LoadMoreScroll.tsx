import { ColorEnum } from "@/core/types&enums/enums";
import { useRef } from "react";

import { useTranslation } from "react-i18next";

interface LoadMoreScrollProps {
  shouldLoadMore: boolean;
  isLoading: boolean;
  currentPage: number;
  loaderColor?: ColorEnum;
  loadMore: () => void;
}

export function LoadMoreScroll({
  shouldLoadMore,
  isLoading,
  currentPage,
  loaderColor,
  loadMore,
}: LoadMoreScrollProps) {
  const intObserver = useRef<any>(null);

  const lastPostRef = (post: HTMLDivElement) => {
    if (isLoading) return;

    if (intObserver.current) intObserver.current.disconnect();

    intObserver.current = new IntersectionObserver((posts) => {
      setTimeout(() => {
        if (posts[0].isIntersecting && shouldLoadMore) {
          loadMore();
        }
      }, 500);
    });

    if (post) intObserver.current.observe(post);
  };
  const getColorClasses = () => {
    let className = "";
    switch (loaderColor) {
      case ColorEnum.PRIMARY:
        className = "text-discord-primary";
      case ColorEnum.SECONDARY:
        className = "text-discord-secondary";
        break;
      case ColorEnum.SUCCESS:
        className = "text-discord-success";
        break;
      case ColorEnum.WARNING:
        className = "text-yellow-500"; // Assuming a yellow color for warning
        break;
      case ColorEnum.DANGER:
        className = "text-discord-danger";
        break;
      default:
        className = "text-white"; // Default color if none specified
    }

    return className;
  };

  return (
    <div
      className={`flex w-full items-center justify-center ${getColorClasses()}`}
      ref={lastPostRef}
    >
      {isLoading && currentPage !== 1 && (
        <div className="flex items-center gap-2">
          <svg
            className={`ml-1 mr-1 h-8 w-8 animate-spin ${getColorClasses()}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}

export default LoadMoreScroll;
