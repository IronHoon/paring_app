import post from '../core/post';
import { API_HOST } from '@env';

const createPost = (formData) => {
  return post(`${API_HOST}/v1/posts`, formData);
};

export default createPost;
