import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function Login() {

  const handleGoogleLogin = async () => {

    await signIn.social(
      { provider: "google", callbackURL:`/` },
      {
        onError: (error) => {
          console.log(error)
          alert("Login failed")
        },
      }
    );
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Button
      type="button"
      className="rounded-[14px]"
      variant="secondary"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={handleGoogleLogin}
      >
        Google Login
      </Button>
    </div>
  );
} 