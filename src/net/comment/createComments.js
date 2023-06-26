import post from '../core/post';
import { API_HOST } from '@env';

const createComments = (postId, content, parent_id) => {
  return post(`${API_HOST}/v1/posts/${postId}/comments`, {
    content,
    parent_id,
  });
};

export default createComments;
