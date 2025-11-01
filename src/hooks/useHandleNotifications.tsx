"use client";
import { markNotificationsRead } from "@/lib/actions";
import { Query_keys } from "@/lib/constants/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useHandleNotifications = () => {
  const queryClient = useQueryClient();
  const markAsRead = useMutation({
    mutationFn: async (id: string) => await markNotificationsRead(id),
    onSettled: () => {
      // Replace optimistic todo in the todos list with the result
      queryClient.invalidateQueries({
        queryKey: [Query_keys.GET_USER_NOTIFICATIONS],
      });
    },
  });
  return { markAsRead };
};

export default useHandleNotifications;
