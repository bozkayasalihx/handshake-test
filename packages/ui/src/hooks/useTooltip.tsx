import { useToast } from "@chakra-ui/react";

interface ITooltip {
  title: string;
}

export const useTooltip = () => {
  const toast = useToast({
    duration: 1000,
    isClosable: true,
    position: "top-right",
    variant: "left-accent",
    status: "error",
  });

  return toast;
};
