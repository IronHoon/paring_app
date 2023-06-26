import { API_HOST } from '@env';
import get from '../core/get';

const checkAvailableName = (name) => {
  return get(`${API_HOST}/v1/check-available-name`, {
    params: {
      name,
    },
  });
};

export default checkAvailableName;
