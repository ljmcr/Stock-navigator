import { NewUserArgs } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Args = {
  onSuccess: () => void;
  onError: (error: unknown) => void;
  method: "POST" | "PUT";
};

export const useUserInfoMutation = ({ onSuccess, onError, method }: Args) =>
  useMutation({
    mutationFn: async (newUserArgs: NewUserArgs) => {
      const response = await fetch(`/api/users`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserArgs),
        method,
      });

      if (!response.ok) {
        throw new Error("Unable to upsert the user");
      }
    },
    onSuccess,
    onError,
  });
