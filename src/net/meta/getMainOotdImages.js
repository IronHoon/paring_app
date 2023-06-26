import get from '../core/get';
import { API_HOST } from '@env';

const getMainOotdImages = (category_id) => {
  return get(`${API_HOST}/v1/meta-data/main-ootd-images`);
};

export default getMainOotdImages;
