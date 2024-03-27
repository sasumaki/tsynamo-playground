import { useState } from "react";

export const useSnackbar = () => {
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const notify = (message: string) => {
    setSnackbarMessage(message);
    setTimeout(() => {
      setSnackbarMessage("");
    }, 3000);
  };

  return { notify, snackbarMessage };
};
