import { API_HOST } from '@env';
import get from '../core/get';

const getMyBookmarks = (page = 1) => {
  return get(`${API_HOST}/v1/me/bookmarks`, {
    params: {
      page,
    },
  });
};

export default getMyBookmarks;
