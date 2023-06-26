import { API_HOST } from '@env';
import patch from '../core/patch';

const patchPosts = (postId, formData) => {
  return patch(`${API_HOST}/v1/posts/${postId}`, formData);
};

export default patchPosts;
