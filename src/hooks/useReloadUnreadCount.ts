import { useAtom } from 'jotai';
import { unreadCountAtom } from '../stores';
import get from '../net/core/get';
import { API_HOST } from '@env';

export function useReloadUnreadCount() {
  const [, setUnreadCount] = useAtom(unreadCountAtom);
  return async function () {
    const [{ unreadCount }] = await get(`${API_HOST}/v1/unread-count`);
    setUnreadCount(unreadCount);
  };
}
