import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useRefreshQuery = () => {
  const queryClient = useQueryClient();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshQuery = async (queryKey: string | string[]) => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const refreshMultipleQueries = async (queryKeys: (string | string[])[]) => {
    setIsRefreshing(true);
    try {
      await Promise.all(
        queryKeys.map((queryKey) =>
          queryClient.invalidateQueries({
            queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
          })
        )
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  return { refreshQuery, refreshMultipleQueries, isRefreshing };
};
