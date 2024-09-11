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

interface signInCardProps {
  setState: (state: signInFlow) => void;
}

export const SignInCard = ({ setState }: signInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuthActions();

  const handleProviderSignin = async (value: "github" | "google") => {
    console.log(`Signing in with ${value}`);
    try{
      const temp = await signIn(value);
      console.log(temp);
    }catch(err){
      console.log({'err': err});
    }finally{
      console.log("Hello Finally!!!!");
    }
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-5 pb-0">
        <form
          onClick={(e) => {
            e.preventDefault();
          }}
          className="space-y-2 5"
        >
          <Input
            disabled={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={false}
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
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={false}
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
            disabled={false}
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
