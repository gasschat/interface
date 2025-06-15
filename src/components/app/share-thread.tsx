import { useState } from "react";
import { XIcon } from "lucide-react";
import { IconLink, IconShare3, IconLoader } from "@tabler/icons-react";

import { Dialog, DialogHeader, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

import useSWRMutation from "swr/mutation";
import { api } from "@/lib/baseUrl";

import { shareThread } from "@/lib/fetch";
import useSWR, { mutate } from "swr";
import { Loader } from "./Loader";
import { Input } from "../ui/input";
import type { ThreadOverview } from "@/lib/types";

const ShareThread = ({
  openWindow,
  handleOpenWindow,
  threadId,
}: {
  openWindow: boolean;
  handleOpenWindow: (state: boolean) => void;
  threadId: string;
}) => {
  const { data: thread, isLoading } = useSWR(
    `${api}/ai/publish-thread/${threadId}`,
    shareThread
  );
  const { trigger: makeItPublic, isMutating } = useSWRMutation(
    `${api}/ai/publish-thread/${threadId}?isp=${!thread?.isPublic}`,
    shareThread
  );
  const link = `localhost:5173/share/${threadId}}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    window.navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
      })
      .catch(console.log);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareThread = () => {
    makeItPublic()
      .then(
        async () =>
          await mutate<ThreadOverview>(`${api}/ai/publish-thread/${threadId}`)
      )
      .catch(console.log);
  };
  if (isLoading) return <Loader />;
  if (!thread) return <span>Inalid request</span>;


  return (
    <Dialog open={openWindow}>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto bg-base-900 outline-none"
        tabIndex={-1}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-normal outline-none">
            Share Chat
          </DialogTitle>
        </DialogHeader>
        <button
          onClick={() => handleOpenWindow(false)}
          type="button"
          className="cursor-pointer w-fit absolute right-0 m-4"
        >
          <XIcon />
        </button>

        <div className="space-y-4 mt-1">
          <p>
            Share your chat{" "}
            <span className="italic underline text-left">{thread.title}</span>
          </p>

          <div className="flex space-x-2 w-full max-w-md">
            {thread.isPublic ? (
              <>
                <Input value={link} className="flex-1" disabled />
                <Button onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy link"}
                </Button>
              </>
            ) : (
              <>
                <Input value={link} className="flex-1" disabled />
                <Button onClick={handleShareThread}>
                  {isMutating ? (
                    <span className="animate-spin">
                      <IconLoader />
                    </span>
                  ) : (
                    <IconLink />
                  )}{" "}
                  Share it
                </Button>
              </>
            )}
          </div>

          {thread.isPublic&&(
            <p 
          role="button"
          onClick={handleShareThread}
          className="text-destructive/75 self-center cursor-pointer hover:underline text-xs text-center mr-20">Make it private</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ShareThreadBtn = ({ threadId }: { threadId: string }) => {
  const [openShareThreadWindow, setOpenShareThreadWindow] =
    useState<boolean>(false);

  const handleShareThreadWindowState = (state: boolean) => {
    setOpenShareThreadWindow(state);
  };
  return (
    <>
      <div
        role="button"
        onClick={() => handleShareThreadWindowState(true)}
        className="flex flex-row items-center gap-2 w-full"
      >
        <IconShare3 />
        <span>Share</span>
      </div>
      {openShareThreadWindow && (
        <ShareThread
          openWindow={openShareThreadWindow}
          handleOpenWindow={handleShareThreadWindowState}
          threadId={threadId}
        />
      )}
    </>
  );
};

export { ShareThread, ShareThreadBtn };
