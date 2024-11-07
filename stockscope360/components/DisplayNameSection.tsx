import { useUser } from "@/hooks/useUser";
import { Typography } from "@mui/material";
import { UpdateDisplayNameModal } from "./UpdateDisplayNameModal";
import { useSettingsContext } from "@/context/SettingsContext";

export const DisplayNameSection = () => {
  const { email } = useSettingsContext();
  const { userInfo } = useUser({
    email: email,
  });

  return (
    <>
      {userInfo && email && (
        <div className="flex items-center">
          <Typography variant="subtitle1" className="text-blue-800">
            {`Hi, ${
              userInfo.DisplayName
                ? userInfo.DisplayName
                : userInfo.FirstName +
                  (userInfo.LastName ? ` ${userInfo.LastName}` : "")
            }`}
          </Typography>
          <UpdateDisplayNameModal displayName={userInfo.DisplayName} />
        </div>
      )}
    </>
  );
};
