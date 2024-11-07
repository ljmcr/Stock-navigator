import { useSettingsContext } from "@/context/SettingsContext";
import { useUserInfoMutation } from "@/hooks/useUserMutation";
import { Button } from "@mui/material";
import { signIn, signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export const SignInButton = () => {
  const { name, email } = useSettingsContext();
  const [isMutationCalled, setIsMutationCalled] = useState(false);

  const handleSignIn = useCallback(() => signIn("google"), []);
  const handleSignOut = useCallback(() => signOut(), []);

  const putUserInfoMutation = useUserInfoMutation({
    method: "PUT",
    onSuccess: () => {
      console.log("Success to upsert user");
    },
    onError: () => {
      console.log("Failed to upsert user");
    },
  });

  useEffect(() => {
    if (name && email && !isMutationCalled) {
      putUserInfoMutation.mutate({
        name,
        email,
      });
      setIsMutationCalled(true);
    }
  }, [isMutationCalled, putUserInfoMutation, email, name]);

  return (
    <>
      {email ? (
        <Button variant="text" onClick={handleSignOut}>
          Sign Out
        </Button>
      ) : (
        <Button variant="text" onClick={handleSignIn}>
          Sign In
        </Button>
      )}
    </>
  );
};
