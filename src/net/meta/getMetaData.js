import get from '../core/get';
import { API_HOST } from '@env';

const getMetaData = (key) => {
  return get(`${API_HOST}/v1/meta-data`, {
    params: {
      key: key,
    },
  });
};

export default getMetaData;
