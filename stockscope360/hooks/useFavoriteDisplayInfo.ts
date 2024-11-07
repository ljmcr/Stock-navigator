import { fetcher } from "@/libs/utils";
import { StockDisplayInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  email: string;
  start_date: string;
  end_date: string;
  currency: string;   // added
  frequency: string;  // added
};

export const useFavoriteDisplayInfo = ({ email, start_date, end_date, currency, frequency }: Args) => {
  const {
    isError:favoriteIsError,
    data: favoriteDisplayInfo,
    isLoading:favoriteIsLoading,
    refetch: favoriteRefetch,
  } = useQuery<StockDisplayInfo[]>({
    queryKey: ["favoriteDisplayInfo", email, start_date, end_date, frequency, currency],
    queryFn: () => fetcher(`/api/defaultFavoriteDisplay?email=${email}&start_date=${start_date}&end_date=${end_date}&currency=${currency}&frequency=${frequency}`),
    enabled: !!email && !!start_date && !!end_date && !!currency && !!frequency,
  });

  return {
    favoriteDisplayInfo,
    favoriteIsLoading,
    favoriteIsError,
    favoriteRefetch
  };
};