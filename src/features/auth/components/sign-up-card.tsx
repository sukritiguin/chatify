import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface signUpCardProps {
  setState: (state: signInFlow) => void;
}

export const SignUpCard = ({ setState }: signUpCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState("signUp");
  const [code, setCode] = useState("");

  const { signIn } = useAuthActions();

  const handleProviderSignin = async (value: "github" | "google") => {
    console.log("Signing in with " + value);
    await signIn(value);
  };

  const onPasswordSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmedPassword) {
      setError("Password and  not same!");
      return;
    }

    setPending(true);
    await signIn("password", { email, password, flow: "signUp" })
      .catch(() => {
        setError("Something went wrong!");
      })
      .finally(() => {
        // setPage("otpauth")
        setPending(false);
      });
  };

  return (
    <>
      {page === "signUp" ? (
        <Card className="w-full h-full p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Signup to continue</CardTitle>
            <CardDescription>
              Use your email or another service to continue
            </CardDescription>
          </CardHeader>
  
          {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md my-2 text-red-500 flex items-center">
              <TriangleAlert className="size-4" />
              <p className="px-2">{error}</p>
            </div>
          )}
  
          <CardContent className="px-0 space-y-5 pb-0">
            <form className="space-y-2" onSubmit={onPasswordSignup}>
              <Input
                disabled={pending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required
              />
              <Input
                disabled={pending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                required
              />
              <Input
                disabled={pending}
                value={confirmedPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmed Password"
                type="password"
                required
              />
              <Button type="submit" className="w-full" size="lg" disabled={pending}>
                Continue
              </Button>
            </form>
  
            <Separator />
  
            <div className="flex flex-col gap-y-2.5">
              <Button
                disabled={pending}
                onClick={() => handleProviderSignin("google")}
                variant="outline"
                size="lg"
                className="w-full relative"
              >
                <FcGoogle className="size-5 absolute top-2.5 left-2.5" /> Continue
                with Google
              </Button>
              <Button
                disabled={pending}
                onClick={() => handleProviderSignin("github")}
                variant="outline"
                size="lg"
                className="w-full relative"
              >
                <FaGithub className="size-5 absolute top-2.5 left-2.5" /> Continue
                with Github
              </Button>
  
              <div className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <span
                  className="text-sky-700 hover:underline cursor-pointer"
                  onClick={() => setState("signIn")}
                >
                  Signin
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full h-full p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>Enter the code sent to your email</CardDescription>
          </CardHeader>
  
          {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md my-2 text-red-500 flex items-center">
              <TriangleAlert className="size-4" />
              <p className="px-2">Error: {error}</p>
            </div>
          )}
  
          <CardContent className="px-0 space-y-5 pb-0">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                console.log({ "Otp verify form data": formData });
                void signIn("password", formData);
              }}
              className="space-y-2.5"
            >
              <Input
                disabled={pending}
                value={code}
                name="code"
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                type="text"
                required
              />
              <Input
                disabled={pending}
                name="email"
                value={email}
                type="hidden"
              />
              <Input name="flow" value="email-verification" type="hidden" />
              <Button type="submit" className="w-full" size="lg" disabled={pending}>
                Verify Code
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
  
};
