"use client";
import { createAuthClient } from "better-auth/client";
import { useRouter } from "next/navigation";

const useHandleAuth = () => {
  const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  });
  const router = useRouter();

  const signInWithSocial = async (provider: "google" | "github") => {
    await authClient.signIn.social({
      provider: provider,
    });
  };

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/sign-in");
        },
      },
    });
  };

  return { signInWithSocial, signOut };
};

export default useHandleAuth;
