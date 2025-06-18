import type { MessageProps } from "@/lib/types";
import { IconCode } from "@tabler/icons-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CopyToClipboard from "./copy-to-clipboard";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const UserCollapsedInput = ({ content }: { content: string }) => {
  const shouldCollapse = content.length > 110;

  if (!shouldCollapse) {
    return (
      <div className="p-3">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="p-2">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-underline font-light">
          {content.substring(0, 110)}...
        </AccordionTrigger>
        <AccordionContent className="">
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const ChatMessage = ({ id, message, isStreaming }: MessageProps) => {
  return (
    <div className={`px-2 sm:px-4`} key={id}>
      <div className="max-w-xs sm:max-w-md md:max-w-2xl mx-auto flex gap-2 sm:gap-4">
        <div
          className={`h-6 w-6 rounded-[13px] flex items-center justify-center shrink-0 ${
            message.role === "assistant" &&
            "bg-gradient-to-b from-secondary to-accent-foreground"
          }`}
        >
          {message.role === "assistant" && <IconCode className="text-accent" />}
        </div>
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {message.role === "assistant" ? (
            <div className="leading-relaxed flex flex-col gap-4 group">
              <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
              {isStreaming && (
                <span className="block h-2 w-2 bg-accent-foreground"></span>
              )}
              {!isStreaming && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <CopyToClipboard text={message.content} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-baseline-last group">
              <div className="bg-[#161A17] rounded-[27px] ml-auto max-w-[85%] sm:max-w-[70%] text-sm">
                <UserCollapsedInput content={message.content} />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <CopyToClipboard text={message.content} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
