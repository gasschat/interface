import { Skeleton } from "@/components/ui/skeleton"
import { v4 } from "uuid"

interface ChatMessageSkeletonProps {
  isUser?: boolean
  lines?: number
}

export function ChatMessageSkeleton({ isUser = false, lines = 1 }: ChatMessageSkeletonProps) {
  const widths = ["w-32", "w-48", "w-64", "w-40", "w-56", "w-72"]

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[80%] space-y-2">
        {Array.from({ length: lines }).map(() => (
          <Skeleton key={`${v4()}`} className={`h-4 ${widths[Math.floor(Math.random() * widths.length)]}`} />
        ))}
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function ChatMessageSkeletonLoader(){
  return (
    <div className="flex flex-col items-center py-12">
       <div className="space-y-10 md:space-y-6 w-full max-w-lg px-4">
      <ChatMessageSkeleton lines={2} isUser={true}/>
      <ChatMessageSkeleton lines={3} isUser={false}/>
      <ChatMessageSkeleton lines={3} isUser={true}/>
      <ChatMessageSkeleton lines={2} isUser={false}/>
       <ChatMessageSkeleton lines={2} isUser={true}/>
    </div>
    </div>
  )
}
