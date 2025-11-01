'use client';
import { fetchNotifications } from '@/lib/actions';
import { Query_keys } from '@/lib/constants/services';
import { NotificationAll } from '@/types/definitions.types';
import { useQuery } from '@tanstack/react-query';

const useGetUserNotifications = (sessionId: string) => {
  return useQuery({
    queryKey: [Query_keys.GET_USER_NOTIFICATIONS, sessionId],
    queryFn: async (): Promise<NotificationAll[]> =>
      await fetchNotifications(sessionId),
  });
}

export default useGetUserNotifications