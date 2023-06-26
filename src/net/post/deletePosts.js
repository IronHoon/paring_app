import del from '../core/del';
import { API_HOST } from '@env';

const deletePosts = (postId) => {
  return del(`${API_HOST}/v1/posts/${postId}`);
};

export default deletePosts;
