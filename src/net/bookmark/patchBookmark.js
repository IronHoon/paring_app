import { API_HOST } from '@env';
import patch from '../core/patch';

const patchBookmark = (postId) => {
  return patch(`${API_HOST}/v1/posts/${postId}/bookmarks`);
};

export default patchBookmark;
