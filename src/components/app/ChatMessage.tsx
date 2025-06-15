import type { MessageProps } from "@/lib/types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const ChatMessage = ({ id, message, isStreaming }: MessageProps) => {
  return (
    <div className={`px-4 py-3`} key={id}>
      <div className="max-w-2xl mx-auto flex gap-4">
        <div
          className={`h-6 w-6 rounded-[13px] flex items-center justify-center shrink-0 ${
            message.role === "user"
              ? "bg-gray-200"
              : "bg-gradient-to-br from-pink-400 to-yellow-400"
          }`}
        >
          {message.role === "user" ? "U" : "A"}
        </div>
        <div className="flex flex-col gap-4">
          {message.role === "assistant" ? (
            <div className="leading-relaxed flex flex-col gap-4">
              <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
              {isStreaming && (
                <span className="block h-2 w-2 bg-accent-foreground"></span>
              )}
            </div>
          ) : (
            <p className="text-md font-light leading-relaxed ">
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};