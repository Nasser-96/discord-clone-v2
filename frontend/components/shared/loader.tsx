export interface ComponentLoaderProps {
  size?: number;
}

export function ComponentLoader({ size }: ComponentLoaderProps) {
  return (
    <div className={`flex items-center justify-center text-discord-bg`}>
      <svg
        className="ml-1 mr-1 animate-spin text-current"
        xmlns="http://www.w3.org/2000/svg"
        height={size ?? 32}
        width={size ?? 32}
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
  );
}

export default ComponentLoader;
