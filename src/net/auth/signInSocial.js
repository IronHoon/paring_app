import post from '../core/post';
import { API_HOST } from '@env';

const signInSocial = (formData) => {
  return post(`${API_HOST}/v1/sign-in/social`, formData);
};

export default signInSocial;
