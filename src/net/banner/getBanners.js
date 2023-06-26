import { API_HOST } from '@env';
import get from '../core/get';

const getBanners = (type = 'main') => {
  return get(`${API_HOST}/v1/banners`, {
    params: {
      type,
    },
  });
};

export default getBanners;
