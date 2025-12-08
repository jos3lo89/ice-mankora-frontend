import { useQuery } from "@tanstack/react-query";
import { getFloors } from "../service/floors.service";

export const useFloors = () => {
  return useQuery({
    queryKey: ["floors"],
    queryFn: getFloors,
  });
};
