import get from '../core/get';
import { API_HOST } from '@env';

const getVisualDirectors = (userId, page, type) => {
  return get(`${API_HOST}/v1/me/visual-director`);
};

export default getVisualDirectors;
