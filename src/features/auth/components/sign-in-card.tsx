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
import { TriangleAlert } from "lucide-react";
import { signInFlow } from "../types";
import { useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";

interface signInCardProps {
  setState: (state: signInFlow) => void;
}

export const SignInCard = ({ setState }: signInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuthActions();

  const handleProviderSignin = async (value: "github" | "google") => {
    console.log("Signing in with " + value);
    await signIn(value);
  };

  const onPasswordSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid login credentials!");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md my-2 text-red-500 flex items-center">
          {" "}
          <TriangleAlert className="size-4" />
          <p className="px-2">Error</p>
        </div>
      )}
      <CardContent className="px-0 space-y-5 pb-0">
        <form onSubmit={onPasswordSignin} className="space-y-2 5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>

        <div className="text-xs text-muted-foreground flex items-end">
          <span
            className="text-sky-700 hover:underline cursor-pointer text-right"
            onClick={() => {
              setState("reset");
            }}
          >
            Forgot Password?
          </span>
        </div>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => {
              handleProviderSignin("google");
            }}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" /> Continue
            with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => {
              handleProviderSignin("github");
            }}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" /> Continue
            with Github
          </Button>
          <div className="text-xs text-muted-foreground">
            Don&apos;t have an account ?{" "}
            <span
              className="text-sky-700 hover:underline cursor-pointer"
              onClick={() => {
                setState("signUp");
              }}
            >
              Signup
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
