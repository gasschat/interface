import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { LocalAIKeys } from "@/lib/types";
import { LLMSvg } from "@/lib/types";
import { XIcon } from "lucide-react";

// import { useUserProvider } from "@/context/user-provider";


const DIALOG_STYLE = {
  container: "py-1",
  apiContainer: "space-y-3",
  apiHeadingContainer: "flex items-center",
  apiHeadingContainerImg: "h-8 w-8 flex items-center justify-center mr-3",
  apiHeadingImg: "rounded-[16px]",
  apiHeadingContainerTitle: "flex gap-3 items-center",
  apiInputContainer: "flex gap-3",
  apiInputButton: "px-8 mt-3",
};

function capitalizeFirstLetterOfEachWord(str: string) {
  // Check if the input is a string and not empty
  if (typeof str !== "string" || str.length === 0) {
    console.error("Input must be a non-empty string.");
    return ""; // Return an empty string or handle error as appropriate
  }

  // Split the string into an array of words
  // The regex /\s+/ handles multiple spaces between words
  const words = str.split(/\s+/);

  // Map over the array of words, capitalizing the first letter of each word
  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return ""; // Handle empty strings that might result from multiple spaces
    }
    // Capitalize the first letter and concatenate with the rest of the word
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back into a single string with spaces
  return capitalizedWords.join(" ");
}

const APIKeysDialog = ({
  openWindow, windowState
}: {
  openWindow: boolean;
  windowState: (state:boolean) => void;
}) => {

  const {apiKeys, setApiKeys,  saveAPI} = useUserProvider()

  return (
    <Dialog open={openWindow}>
      <DialogContent className="sm:max-w-md" tabIndex={-1}>
        <button
          onClick={() => windowState(false)}
          className="cursor-pointer w-fit absolute right-0 m-4"
        >
          <XIcon />
        </button>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-3xl font-normal">
            Enter Your API Keys
          </DialogTitle>
          <DialogDescription>
            We never keep your API keys in our database. Instead, they are kept
            locally on your browser.
          </DialogDescription>
        </DialogHeader>

        {Object.keys(apiKeys).map((key, index) => {
          const typedKey = key as keyof LocalAIKeys;
          const keyValue = apiKeys[typedKey];

          return (
            <div className={DIALOG_STYLE.container} key={index}>
              <div className={DIALOG_STYLE.apiContainer}>
                <div className={DIALOG_STYLE.apiHeadingContainer}>
                  <div className={DIALOG_STYLE.apiHeadingContainerImg}>
                    <img
                      src={LLMSvg[key]}
                      className={DIALOG_STYLE.apiHeadingImg}
                    />
                  </div>
                  <div className={DIALOG_STYLE.apiHeadingContainerTitle}>
                    <span className="text-sm">
                      {capitalizeFirstLetterOfEachWord(key)}
                    </span>
                    <a href="#" className="text-xs text-blue-400">
                      ( Get your key here )
                    </a>
                  </div>
                </div>
                <div className={DIALOG_STYLE.apiInputContainer}>
                  <Input
                    value={keyValue === null ? "" : keyValue}
                    autoFocus={false}
                    autoComplete="off"
                    onChange={(e) => {
                      setApiKeys((prevKeys) => ({
                        ...prevKeys,
                        [typedKey]: e.target.value || null,
                      }));
                    }}
                    name={key}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={() => saveAPI()}
            className={DIALOG_STYLE.apiInputButton}
          >
            Save
          </Button>
        </DialogFooter>

        <p className="text-center mt-6 text-xs font-light">
          Ensure that the API work's and had credits left.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export { APIKeysDialog };
