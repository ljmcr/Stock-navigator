import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    ChartOptions
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import "chartjs-adapter-date-fns";
import { ChartData, StockDisplayInfo } from "@/types";
import { useDefaultDisplayInfo } from "@/hooks/useDefaultDisplayInfo";
import { useFavoriteDisplayInfo } from "@/hooks/useFavoriteDisplayInfo";
import { useSettingsContext } from "@/context/SettingsContext";
import { CircularProgress } from "@mui/material";


export default function StockChart() {
    const {
        dates,
        isFavorite,
        currency,
        frequency,
        isStockIdsChanged,
        isFavoriteChanged,
        setIsFavoriteChanged,
        email,
    } = useSettingsContext();
    const { startDate, endDate } = dates;
    const [stockIds, setStockIds] = useState<string[]>([]);
    const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });
    const [currentDisplayInfo, setCurrentDisplayInfo] = useState<StockDisplayInfo[]>([]);
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        setStockIds(JSON.parse(localStorage.getItem("stockIds") || "[]"));
    }, [isStockIdsChanged]);

    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate.format("YYYY-MM-DD");
    
    const { defaultDisplayInfo, defaultRefetch, defaultIsError, defaultIsLoading } = useDefaultDisplayInfo({
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        stockIds: stockIds,
        currency: currency,
        frequency: frequency,
    });

    const { favoriteDisplayInfo, favoriteRefetch, favoriteIsError, favoriteIsLoading } = useFavoriteDisplayInfo({
        email: email,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        currency: currency,
        frequency: frequency,
    });

    useEffect(() => {
        if (isFavorite) favoriteRefetch();
        else defaultRefetch();
        setIsFavoriteChanged(false);
    }, [
        defaultRefetch,
        favoriteRefetch,
        isFavorite,
        isStockIdsChanged,
        isFavoriteChanged,
        setIsFavoriteChanged,
    ]);

    useEffect(() => {
        const currentInfo = (isFavorite ? favoriteDisplayInfo : defaultDisplayInfo) || [];
        setCurrentDisplayInfo(currentInfo);
        const hasError = isFavorite ? favoriteIsError : defaultIsError;
        setHasData(!((hasError || !currentInfo || currentInfo.length === 0) && !favoriteIsLoading && !defaultIsLoading));
    }, [isFavorite, favoriteDisplayInfo, defaultDisplayInfo, favoriteIsError, defaultIsError, defaultIsLoading, favoriteIsLoading]);
    
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        TimeScale
    );

    useEffect(() => {
        if (hasData) {
            const labels = currentDisplayInfo.map(info => format(new Date(info.IntervalStart), "yyyy-MM-dd"));

            const stockNames = currentDisplayInfo
                .map((info) => info.StockName)
                .filter(
                (stockName, index, array) => array.indexOf(stockName) === index
            );
            const datasets = stockNames.map(stockName => {
                const stockData = currentDisplayInfo.filter(info => info.StockName === stockName);

                return {
                    label: stockName,
                    data: stockData.map(info => ({
                        x: format(new Date(info.IntervalStart), "yyyy-MM-dd"),
                        y: Number(info.AvgClosingPrice).toFixed(2),
                        avgOpeningPrice: Number(info.AvgOpeningPrice).toFixed(2),
                        High: Number(info.High).toFixed(2),
                        Low: Number(info.Low).toFixed(2),
                        totalVolume: info.TotalVolume,
                    })),
                    borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
                    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
                };
            });
            setChartData({ labels, datasets });
        }
    }, [hasData, currentDisplayInfo]);
    
    const options: ChartOptions<'line'> = {
        responsive: true,
        scales: {
            x: {
                type: "time",
                time: {
                    unit: frequency === "daily" ? "day" : "month",
                    tooltipFormat: "yyyy-MM-dd",
                    displayFormats: {
                        day: "yyyy-MM-dd",
                    }
                },
                title: {
                    display: true,
                    text: "Date"
                }
            },
            y: {
                title: {
                    display: true,
                    text: `Price (${currency})`
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'point',
                intersect: false,
                callbacks: {
                    label: function(context: any) {
                        const point = context.raw;
                        return [
                            `Interval Start: ${context.label}`,
                            `Avg Closing Price: ${point.y}`,
                            `Avg Opening Price: ${point.avgOpeningPrice}`,
                            `High: ${point.High}`,
                            `Low: ${point.Low}`,
                            `Volume: ${point.totalVolume}`
                        ];
                    }
                }
            },
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: "Stock Chart",
            }
        }
    };

    if (favoriteIsLoading || defaultIsLoading) {
        return <CircularProgress />;
    }
    
    return hasData ? (
        <Line options={options} data={chartData} />
    ) : (
        <div>No data available</div>
    );
};
