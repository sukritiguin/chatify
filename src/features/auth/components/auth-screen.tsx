"use client";
import { useState } from "react";
import { signInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import { PasswordReset } from "./PasswordReset";

export const AuthScreen = () => {
  const [state, setState] = useState<signInFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : state === "signUp" ? (
          <SignUpCard setState={setState} />
        ) : (
          <PasswordReset setState={setState}/>
        )}
      </div>
    </div>
  );
};
