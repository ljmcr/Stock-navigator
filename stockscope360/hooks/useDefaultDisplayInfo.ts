import { fetcher } from "@/libs/utils";
import { StockDisplayInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  start_date: String;
  end_date: String;
  stockIds: string[];
  currency: string;
  frequency: string;
};

export const useDefaultDisplayInfo = ({
  start_date,
  end_date,
  stockIds,
  currency,
  frequency,
}: Args) => {
  const { isError, data, isLoading, refetch } = useQuery<StockDisplayInfo[]>({
    queryKey: ["defaultDisplayInfo", start_date, end_date, stockIds, currency, frequency],
    queryFn: () =>
      fetcher(
        `/api/defaultFavoriteDisplay?start_date=${start_date}&end_date=${end_date}&stockIds=${stockIds.join(
          ","
        )}&currency=${currency}&frequency=${frequency}`
      ),
    enabled: !!start_date && !!end_date && stockIds.length > 0 && !!currency && !!frequency,
  });

  return {
    defaultDisplayInfo: data,
    defaultIsLoading: isLoading,
    defaultIsError: isError,
    defaultRefetch: refetch,
  };
};
