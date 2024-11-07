import { fetcher } from "@/libs/utils";
import { useQuery } from "@tanstack/react-query";
import { IndustryInfo } from "@/types";

export const useIndustryInfo = () => {
  const {
    isError,
    data: industryInfo,
    isLoading,
  } = useQuery<IndustryInfo[]>({
    queryKey: ["uniqueIndustry"],
    queryFn: () => {
      return fetcher(`/api/getIndustry`)
    },
  });

  return {
    industryInfo,
    isLoading,
    isError,
  };
};
