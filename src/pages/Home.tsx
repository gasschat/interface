import { UserInput } from "@/components/app/userInput";
import { useSession } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function Home() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session?.user) {
      void navigate("/login");
    }
  }, [isPending, session, navigate]);

  return (
    <div className="flex flex-col min-h-[27rem] justify-center w-full max-w-2xl mx-auto px-4">
      <div className="relative flex flex-col gap-7">
        <h1 className="text-4xl  font-medium md:font-medium text-left md:text-center tracking-tight ">
          Touch genius.<br className="block md:hidden" /> Think limitless
        </h1>
        <UserInput/>
      </div>
    </div>
  );
}
