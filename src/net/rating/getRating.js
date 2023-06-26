import get from '../core/get';
import { API_HOST } from '@env';

const getRating = (postId) => {
  return get(`${API_HOST}/v1/posts/${postId}/rating`);
};

export default getRating;
