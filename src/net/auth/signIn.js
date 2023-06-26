import post from '../core/post';
import { API_HOST } from '@env';

const signIn = (params) => {
  return post(`${API_HOST}/v1/sign-in`, params);
};

export default signIn;
