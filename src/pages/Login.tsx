import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";


import { Card, CardContent } from "@/components/ui/card"


function LoginForm() {


  const handleGoogleLogin = async () => {
    await signIn.social(
      { provider: "google", callbackURL: "https://tabs.chat"},
      {
        onError: (error) => {
          console.log(error)
          alert("Login failed")
        },
      }
    );
  };


  return (
    <div className={"flex flex-col gap-6"}>
      <Card className="overflow-hidden w-[70vw] h-[70vh]">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          <form className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Tabs</h1>
                <p className="text-balance text-muted-foreground">all in one ai chat app</p>
              </div>
              <Button 
              type="button"
              onClick={()=>void handleGoogleLogin()}
              variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </Button>
              <div className="text-center text-sm text-muted-foreground">made by ai (actual Indian 😉)</div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://pbs.twimg.com/media/GtcQ-_KasAAUBFX?format=jpg&name=4096x4096"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Built by <a className="cursor-pointer" target="_blank" href="https://x.com/aditya_pushkar_" rel="noreferrer noopener">aditya_pushkar</a>
      </div>
    </div>
  )
}


export default function Login() {

return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  )}