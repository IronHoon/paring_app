import get from '../core/get';
import { API_HOST } from '@env';

const getPairingIndex = (postId) => {
  return get(`${API_HOST}/v1/posts/${postId}/pairing`);
};

export default getPairingIndex;
