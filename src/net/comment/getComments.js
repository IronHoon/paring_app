import get from '../core/get';
import { API_HOST } from '@env';

const getComments = (postId) => {
  return get(`${API_HOST}/v1/posts/${postId}/comments`);
};

export default getComments;
