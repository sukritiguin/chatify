import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import {Password} from "@convex-dev/auth/providers/password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Google, Password],
});
