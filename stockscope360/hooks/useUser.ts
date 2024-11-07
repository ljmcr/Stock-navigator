import { fetcher } from "@/libs/utils";
import { UserInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  email: string;
};

export const useUser = ({ email }: Args) => {
  const {
    isError,
    data: userInfo,
    isLoading,
  } = useQuery<UserInfo>({
    queryKey: ["userEmail", email],
    queryFn: () => fetcher(`/api/users?email=${email}`),
    enabled: !!email,
  });

  return {
    userInfo,
    isLoading,
    isError,
  };
};
