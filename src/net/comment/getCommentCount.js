import get from '../core/get';
import { API_HOST } from '@env';

const getCommentCount = (postId) => {
  return get(`${API_HOST}/v1/posts/${postId}/comments/count`);
};

export default getCommentCount;
