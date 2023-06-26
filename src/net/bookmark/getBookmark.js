import { API_HOST } from '@env';
import get from '../core/get';

const getBookmark = (postId) => {
  return get(`${API_HOST}/v1/posts/${postId}/bookmarks`);
};

export default getBookmark;
