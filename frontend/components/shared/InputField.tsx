import { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export default function InputField({ error, ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-0 w-full">
      {props?.["aria-label"] && (
        <label
          className="block text-sm text-discord-muted mb-1"
          htmlFor={props.id}
        >
          {props["aria-label"]}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-2 rounded-md bg-[#1e1f22] text-white border border-[#2b2d31] focus:outline-none focus:ring-2 focus:ring-discord-primary ${props.className}`}
      />
      <span className="text-red-400 text-sm">{error}</span>
    </div>
  );
}
