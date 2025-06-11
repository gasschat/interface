import { Loader2, XIcon } from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import type { ThreadOverview } from "@/lib/types";

import useSWRMutation from "swr/mutation";
import { api } from "@/lib/baseUrl";

import { deleteThread } from "@/lib/fetch";
import { useLocation, useNavigate } from "react-router";

const DeleteThread = ({
  openWindow,
  handleOpenWindow,
  thread,
}: {
  openWindow: boolean;
  handleOpenWindow: (state: boolean) => void;
  thread: ThreadOverview;
}) => {
  const { trigger, isMutating } = useSWRMutation(
    `${api}/ai/delete-thread/${thread.id}`,
    deleteThread
  );
  const currentLocation = location.pathname.split("/")[2]
  const navigate = useNavigate()
  console.log(currentLocation)

  const handleDelete = () => {
    trigger()
      .then(async() => {
        if(thread.id===currentLocation){
            await navigate("/")
        }
        handleOpenWindow(false);
      })
      .catch((err) => {
        console.error("Delete failed:", err);
      });
  };

  return (
    <Dialog open={openWindow}>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto bg-base-900"
        tabIndex={-1}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-normal">
            Delete Thread
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
            You sure you wanna delete{" "}
            <span className="italic underline">{thread.title}</span>? You can’t
            undo this if you do.
          </p>
          <Button
            type="button"
            variant="destructive"
            disabled={isMutating}
            onClick={handleDelete}
          >
            Delete
            {isMutating && (
              <span className="animate-spin">
                <Loader2 />
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export { DeleteThread };
