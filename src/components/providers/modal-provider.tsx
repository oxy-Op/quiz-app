import { useEffect, useState } from "react";
import EditProfile from "../modals/edit-profile";
import Settings from "../modals/settings";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <EditProfile />
      <Settings />
    </>
  );
};
