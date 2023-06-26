import get from '../core/get';
import { API_HOST } from '@env';

const getPost = (id) => {
  return get(`${API_HOST}/v1/posts/${id}`);
};

export default getPost;
