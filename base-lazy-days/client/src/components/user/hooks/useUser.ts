import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useEffect } from 'react';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

async function getUser(user: User | null): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
    },
  );
  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();
  // TODO: call useQuery to update user data from server
  const { data: user } = useQuery({
    queryKey: [queryKeys.user],
    queryFn: () => getUser(user),
    initialData: getStoredUser,
  });

  /**
   * This effect replaces the use of the onSuccess callback of useQuery
   */
  useEffect(() => {
    if (!user) {
      clearStoredUser();
    } else {
      setStoredUser(user);
    }
  }, [user]);

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
    queryClient.setQueryData([queryKeys.user], newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
    queryClient.setQueryData([queryKeys.user], null);
    queryClient.removeQueries({ queryKey: ['user-appointments'] });
  }

  return { user, updateUser, clearUser };
}
