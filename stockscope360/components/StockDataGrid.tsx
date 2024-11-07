import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Popover,
  Typography,
} from "@mui/material";
import { useStockInfo } from "@/hooks/useStock";
import { useStockMetaInfo } from "@/hooks/useStockMetaInfo";
import { EditFavoritesArgs, StockTableInfo } from "@/types";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavoritesMutation } from "@/hooks/useFavoritesMutation";
import { useUserInfoMutation } from "@/hooks/useUserMutation";
import { UseMutationResult } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { useIndustryInfo } from "@/hooks/useIndustry";
import AddToDefaultButton from "@/components/AddToDefaultButton";
import { useSettingsContext } from "@/context/SettingsContext";

function createColumns({
  email,
  postFavoritesMutation,
}: {
  postFavoritesMutation: UseMutationResult<
    void,
    unknown,
    EditFavoritesArgs,
    unknown
  >;
  email: string;
}): GridColDef<StockTableInfo>[] {
  const columns: GridColDef<StockTableInfo[][number]>[] = [
    {
      field: "IsFavorite",
      headerName: "",
      sortable: false,
      width: 30,
      disableColumnMenu: true,
      renderCell: (param) => {
        const isFavorite = param.row.IsFavorite;
        const stockId = param.row.StockId;

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation(); // Prevent pop over when clicking favroite icon
          postFavoritesMutation.mutate({
            email: email,
            stockId: stockId,
            isFavorite,
          });
        };

        return (
          <>
            {email && (
              <div className="flex items-center justify-center h-full">
                <IconButton onClick={handleClick}>
                  {isFavorite ? (
                    <FavoriteIcon className="text-red-600" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "StockId",
      headerName: "ID",
      width: 100,
      disableColumnMenu: true,
    },
    {
      field: "StockName",
      headerName: "Name",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "StockCompany",
      headerName: "Company",
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: "AvgPrice",
      headerName: "Average Price (Closing)",
      width: 200,
      valueGetter: (value, row) => row.AvgPrice.toFixed(2),
      disableColumnMenu: true,
    },
  ];
  return columns;
}

export default function StockDataGrid() {
  const { setCurrency, currency, setIsFavoriteChanged, email } =
    useSettingsContext();
  const [stockQuery, setStockQuery] = useState<string>(" ");
  const [industry, setIndustry] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("Name");
  const [marketName, setMarketName] = useState<string>("USA");
  const [error, setError] = useState<string | undefined>(undefined);

  const { userInfo, isLoading: isUserLoading } = useUser({
    email: email,
  });

  useEffect(() => {
    // Update initial state of currency when useUser() is finished
    if (userInfo) {
      setCurrency(
        userInfo.CurrencyName == null ? "USD" : userInfo.CurrencyName
      );
    }
  }, [setCurrency, userInfo]);

  const markets = [
    { value: "USA", label: "United States of America" },
    { value: "Thai", label: "Thailand" },
  ];

  const searchTypes = [
    { value: "Name", label: "Stock/Company Name" },
    { value: "Industry", label: "Industry" },
  ];

  const currencies = [
    { value: "USD", label: "USD" },
    { value: "THB", label: "THB" },
  ];

  const { stockTableInfo, refetch } = useStockInfo({
    stockQuery: stockQuery.trim() != "" ? stockQuery.trim() : " ",
    industry: industry.trim() != "" ? industry.trim() : " ",
    searchType: searchType,
    marketName: marketName,
    currency: currency,
    email: email,
  });

  const { industryInfo, isLoading: industryInfoIsLoading } = useIndustryInfo();

  const postFavoritesMutation = useFavoritesMutation({
    method: "POST",
    onSuccess: () => {
      setIsFavoriteChanged(true);
      refetch();
    },
    onError: () => {},
  });

  const postUserInfoMutation = useUserInfoMutation({
    method: "POST",
    onSuccess: () => {
      setError(undefined);
    },
    onError: () => {
      setError("Failed to update perferred currency!");
    },
  });

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(
    null
  );
  const [selectedRow, setSelectedRow] = useState(null);
  const { stockMetaInfo, stockMetaInfo_isLoading, stockMetaInfo_isError } =
    useStockMetaInfo({ stockId: selectedRow });

  const dataGridRef = useRef(null);

  const handleRowClick = (params: any, event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(params.row.StockId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      {!isUserLoading && !industryInfoIsLoading ? (
        <Box sx={{ height: 400, width: "100%" }}>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
          >
            <TextField
              id="select-market"
              label="Market"
              select
              defaultValue="USA"
              value={marketName}
              onChange={(event) => {
                setMarketName(event.target.value);
              }}
            >
              {markets.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <>
              <TextField
                id="select-currency"
                label="Currency"
                select
                defaultValue="USD"
                value={currency}
                onChange={(event) => {
                  setCurrency(event.target.value);
                  if (userInfo) {
                    postUserInfoMutation.mutate({
                      name: userInfo?.DisplayName,
                      email: userInfo?.Email,
                      currency: event.target.value,
                    });
                  }
                }}
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {error && (
                <Typography className="text-red-600">{error}</Typography>
              )}
            </>
            <TextField
              id="select-search"
              label="Search by"
              select
              value={searchType}
              onChange={(event) => {
                setSearchType(event.target.value);
              }}
            >
              {searchTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {searchType == "Name" && (
              <TextField
                id="search-name-company"
                label="Name/Company"
                value={stockQuery}
                onChange={(event) => {
                  setStockQuery(event.target.value);
                }}
              />
            )}

            {searchType == "Industry" && (
              <TextField
                id="select-industry"
                label="Industry"
                select
                value={industry}
                onChange={(event) => {
                  setIndustry(event.target.value);
                }}
              >
                {industryInfo?.map((option) => (
                  <MenuItem key={option.Industry} value={option.Industry}>
                    {option.Industry}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>

          <Box sx={{ height: 400, width: "100%", padding: 2 }}>
            {stockTableInfo ? (
              <DataGrid
                rows={stockTableInfo}
                columns={createColumns({
                  email: email,
                  postFavoritesMutation: postFavoritesMutation,
                })}
                getRowId={(row) => row.StockId}
                ref={dataGridRef}
                onRowClick={handleRowClick}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                  "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                    outline: "none !important",
                  },
                }}
              />
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Box>
      ) : (
        <CircularProgress />
      )}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Box p={2}>
          <Typography variant="h6">Stock Details</Typography>
          {stockMetaInfo_isLoading ? (
            <Typography>Loading...</Typography>
          ) : stockMetaInfo_isError ? (
            <Typography>Error loading info</Typography>
          ) : (
            <>
              <Typography>
                Name: {stockMetaInfo?.Name} <br />
                Company: {stockMetaInfo?.Company} <br />
                Industry: {stockMetaInfo?.Industry}
              </Typography>
              {selectedRow && <AddToDefaultButton stockId={selectedRow} />}
            </>
          )}
        </Box>
      </Popover>
    </Box>
  );
}
