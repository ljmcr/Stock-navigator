import { fetcher } from "@/libs/utils";
import { StockTableInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";

type searchStockArgs = {
  stockQuery: string;
  industry: string;
  searchType: string;
  marketName: string;
  currency: string;
  email: string;
};

export const useStockInfo = ({
  stockQuery,
  industry,
  searchType,
  marketName,
  currency,
  email,
}: searchStockArgs) => {
  const {
    isError,
    data: stockTableInfo,
    isLoading,
    refetch,
  } = useQuery<StockTableInfo[]>({
    queryKey: ["searchStock", stockQuery, industry, searchType, marketName, currency],
    queryFn: () => {
      let url = `/api/searchStock?`

      if (searchType == "Name") { // Search by stock name and company name
        url += `stockQuery=${stockQuery}`
      }
      if (searchType == "Industry") { // Search by industry
        if (industry == " ") { // No industry selected
          url += `stockQuery=${" "}`
        } else {
          url += `industry=${industry}`
        }
      }

      url += `&marketName=${marketName}&currency=${currency}`

      if (email) {
        url += `&email=${email}`
      }

      return fetcher(url)
    },
    enabled: !!stockQuery && !!industry && !!searchType && !!marketName && !!currency,
  });

  return {
    stockTableInfo,
    isLoading,
    isError,
    refetch,
  };
};
