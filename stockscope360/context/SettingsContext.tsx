import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";

interface DateValues {
  startDate: Dayjs;
  endDate: Dayjs;
}

interface SettingsContextType {
  dates: DateValues;
  setDates: Dispatch<SetStateAction<DateValues>>;
  isFavorite: boolean;
  setIsFavorite: Dispatch<SetStateAction<boolean>>;
  isStockIdsChanged: boolean;
  setIsStockIdsChanged: Dispatch<SetStateAction<boolean>>;
  currency: string;
  setCurrency: Dispatch<SetStateAction<string>>;
  frequency: string;
  setFrequency: Dispatch<SetStateAction<string>>;
  isFavoriteChanged: boolean;
  setIsFavoriteChanged: Dispatch<SetStateAction<boolean>>;
  email: string;
  name: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext must be used within a SettingsProvider"
    );
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [dates, setDates] = useState<DateValues>({
    startDate: dayjs("2019-01-01"),
    endDate: dayjs("2023-12-31")
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [isStockIdsChanged, setIsStockIdsChanged] = useState(false);
  const [currency, setCurrency] = useState<string>("USD");
  const [frequency, setFrequency] = useState<string>("monthly");
  const [isFavoriteChanged, setIsFavoriteChanged] = useState(false);
  const { data: session } = useSession();
  const email = session?.user?.email || "";
  const name = session?.user?.name || "";

  return (
    <SettingsContext.Provider
      value={{
        dates,
        setDates,
        isFavorite,
        setIsFavorite,
        isStockIdsChanged,
        setIsStockIdsChanged,
        currency,
        setCurrency,
        frequency,
        setFrequency,
        isFavoriteChanged,
        setIsFavoriteChanged,
        email,
        name,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
