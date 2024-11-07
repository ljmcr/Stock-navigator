import { fetcher } from "@/libs/utils";
import { StockMetaInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
    stockId: number | null;
};

export const useStockMetaInfo = ({ stockId }: Args) => {
    const {
        data: stockMetaInfo,
        isLoading: stockMetaInfo_isLoading,
        isError: stockMetaInfo_isError,
    } = useQuery<StockMetaInfo>({
        queryKey: ["stockInfo", stockId],
        queryFn: () =>fetcher(`/api/fetchStock?stockId=${stockId}`), 
        enabled: !!stockId,
    });

    return {
        stockMetaInfo,
        stockMetaInfo_isLoading,
        stockMetaInfo_isError,
    };
};