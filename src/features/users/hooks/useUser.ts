import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/user.service";

export const useUser = () => {
  const getUserProfileQuery = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  return { getUserProfileQuery };
};
