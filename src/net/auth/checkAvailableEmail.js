import { API_HOST } from '@env';
import get from '../core/get';

const checkAvailableEmail = (email) => {
  return get(`${API_HOST}/v1/check-available-email`, {
    params: {
      email,
    },
  });
};

export default checkAvailableEmail;
