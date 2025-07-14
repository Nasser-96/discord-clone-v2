import { JSX } from "react";

interface AuthContainerProps {
  title: string;
  children: JSX.Element;
}
export default function AuthUiContainer({
  title,
  children,
}: AuthContainerProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-[#313338] text-discord-text flex flex-col gap-6">
        <h1 className="text-4xl font-semibold text-center text-white">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
