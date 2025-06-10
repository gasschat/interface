import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Index() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    }
  }, [isPending, session, navigate]);

  return null;
} 