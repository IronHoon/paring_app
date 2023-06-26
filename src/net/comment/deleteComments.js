import del from '../core/del';
import { API_HOST } from '@env';

const deleteComments = (postId, commentId) => {
  return del(`${API_HOST}/v1/posts/${postId}/comments/${commentId}`);
};

export default deleteComments;
