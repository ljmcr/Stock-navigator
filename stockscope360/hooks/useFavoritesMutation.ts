import { EditFavoritesArgs } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Args = {
  onSuccess: () => void;
  onError: (error: unknown) => void;
  method: "POST";
};

export const useFavoritesMutation = ({ onSuccess, onError, method }: Args) =>
  useMutation({
    mutationFn: async (editFavoritesArgs: EditFavoritesArgs) => {
      const response = await fetch(`/api/favorites`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFavoritesArgs),
        method,
      });

      if (!response.ok) {
        throw new Error("Unable to update Favorites");
      }
    },
    onSuccess,
    onError,
  });
