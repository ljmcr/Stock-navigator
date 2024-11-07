import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useUserInfoMutation } from "@/hooks/useUserMutation";
import { useSettingsContext } from "@/context/SettingsContext";

type Props = {
  displayName: string;
};

export const UpdateDisplayNameModal = ({ displayName }: Props) => {
  const { email } = useSettingsContext();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState(displayName);
  const [error, setError] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const postUserInfoMutation = useUserInfoMutation({
    method: "POST",
    onSuccess: () => handleClose,
    onError: () => {
      setError("Failed to update display name!");
    },
  });

  return (
    <>
      <IconButton onClick={handleOpen}>
        <SettingsIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className="flex justify-between gap-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-white p-4">
          <div>
            <form>
              <h1 className="text-xl text-blue-700">Update Display Name</h1>
              <input
                type="text"
                id="displayName"
                name="displayName"
                className="bg-gray-300 border-2 border-black rounded-lg"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                id="email"
                name="email"
                type="hidden"
                defaultValue={email}
              />
              <Button
                onClick={() => {
                  postUserInfoMutation.mutate({
                    name: newName,
                    email: email,
                  });
                }}
                type="submit"
              >
                Save
              </Button>
            </form>
            {error && <Typography className="text-red-600">{error}</Typography>}
          </div>
          <IconButton onClick={handleClose} className="p-0 flex items-start">
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>
    </>
  );
};
