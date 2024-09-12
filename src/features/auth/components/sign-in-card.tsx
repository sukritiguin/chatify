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
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | "signUp" | { email: string }>(
    "signIn"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleProviderSignin = async (value: "github" | "google") => {
    console.log("Signing in with " + value);
    await signIn(value);
  };

  const onPasswordSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .then(() => setStep({ email })) // Move to OTP verification step
      .catch(() => {
        setError("Invalid login credentials!");
      })
      .finally(() => {
        setPending(false);
      });
  };

  // const onOTPSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setPending(true);
  //   signIn("resend-otp", { email, code }) // Use OTP for verification
  //     .catch((err) => {
  //       console.log(err);
  //       setError("Invalid OTP!");
  //     })
  //     .finally(() => {
  //       setPending(false);
  //     });
  // };

  return step === "signIn" || step === "signUp" ? (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md my-2 text-red-500 flex items-center">
          <TriangleAlert className="size-4" />
          <p className="px-2">Error: {error}</p>
        </div>
      )}
      <CardContent className="px-0 space-y-5 pb-0">
        <form
          // onSubmit={(event) => {
          //   event.preventDefault();
          //   const formData = new FormData(event.currentTarget);
          //   console.log({ "Send OTP form data": formData });
          //   void signIn("password", formData).then(() =>
          //     setStep({ email: formData.get("email") as string })
          //   );
          // }}
          onSubmit={onPasswordSignin}
          className="space-y-2.5"
        >
          <Input
            disabled={pending}
            value={email}
            name="email"
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
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            type="password"
            required
          />
          <Input name="flow" value={step} type="hidden" />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
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
          // onSubmit={onOTPSubmit}
          // onSubmit={(event) => {
          //   event.preventDefault();
          //   const formData = new FormData(event.currentTarget);
          //   void signIn("resend-otp", formData);
          // }}
          className="space-y-2.5"
        >
          <Input
            disabled={pending}
            value={code}
            name="code"
            onChange={(e) => {
              setCode(e.target.value);
            }}
            placeholder="Enter verification code"
            type="text"
            required
          />
          <Input
            disabled={pending}
            name="email"
            value={step.email}
            type="hidden"
          />
          <Input name="flow" value="email-verification" type="hidden" />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Verify Code
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};


// import { useAuthActions } from "@convex-dev/auth/react";
// import { useState } from "react";
 
// export function SignInCard() {
//   const { signIn } = useAuthActions();
//   const [step, setStep] = useState<"signIn" | "signUp" | { email: string }>(
//     "signIn",
//   );
//   return step === "signIn" || step === "signUp" ? (
//     <form
//       onSubmit={(event) => {
//         event.preventDefault();
//         const formData = new FormData(event.currentTarget);
//         void signIn("password", formData).then(() =>
//           setStep({ email: formData.get("email") as string }),
//         );
//       }}
//     >
//       <input name="email" placeholder="Email" type="text" />
//       <input name="password" placeholder="Password" type="password" />
//       <input name="flow" value={step} type="hidden" />
//       <button type="submit">{step === "signIn" ? "Sign in" : "Sign up"}</button>
//       <button
//         type="button"
//         onClick={() => {
//           setStep(step === "signIn" ? "signUp" : "signIn");
//         }}
//       >
//         {step === "signIn" ? "Sign up instead" : "Sign in instead"}
//       </button>
//     </form>
//   ) : (
//     <form
//       onSubmit={(event) => {
//         event.preventDefault();
//         const formData = new FormData(event.currentTarget);
//         void signIn("password", formData);
//       }}
//     >
//       <input name="code" placeholder="Code" type="text" />
//       <input name="email" value={step.email} type="hidden" />
//       <button type="submit">Continue</button>
//       <button type="button" onClick={() => setStep("signIn")}>
//         Cancel
//       </button>
//     </form>
//   );
// }