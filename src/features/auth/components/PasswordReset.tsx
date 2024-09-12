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

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { signInFlow } from "../types";

const CommonHeader = () => {
  return (
    <>
      <CardHeader className="px-0 pt-0">
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>Email your email to reset password</CardDescription>
      </CardHeader>
    </>
  );
};

interface signInCardProps {
  setState: (state: signInFlow) => void;
}

export function PasswordReset({ setState }: signInCardProps) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  return step === "forgot" ? (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log(formData);
        void signIn("password", formData).then(() =>
          setStep({ email: formData.get("email") as string })
        );
      }}
    >
      <Card className="w-full h-full p-8">
        <CommonHeader />
        <CardContent className="px-0 space-y-5 pb-0">
          <Input
            disabled={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            type="email"
            name="email"
            required
          />
          <Input disabled={false} value="reset" type="hidden" name="flow" />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Send Code
          </Button>
        </CardContent>
        <Separator />
      </Card>
    </form>
  ) : (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData);
      }}
    >
      <Card className="w-full h-full p-8">
        <CommonHeader />
        <CardContent className="px-0 space-y-5 pb-0">
          <Input
            disabled={false}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
            name="code"
            placeholder="Verification Code"
            type="text"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            name="newPassword"
            placeholder="New Password"
            type="password"
            required
          />
          <Input
            disabled={false}
            value={step.email}
            name="email"
            placeholder="New Password"
            type="hidden"
          />
          <Input
            disabled={false}
            value="reset-verification"
            name="flow"
            placeholder="New Password"
            type="hidden"
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </CardContent>
        <Separator />
        <Button
          type="button"
          className="w-full bg-destructive my-2"
          size="lg"
          disabled={false}
          onClick={() => {
            setState("signIn");
          }}
        >
          Cancel
        </Button>
      </Card>
      {/* <button type="button" onClick={() => setStep("signIn")}>
        Cancel
      </button> */}
    </form>
  );
}
