import post from '../core/post';
import { API_HOST } from '@env';

const registerFCMToken = (formData) => {
  return post(`${API_HOST}/v1/me/fcm-tokens`, formData);
};

export default registerFCMToken;
