import get from '../core/get';
import { API_HOST } from '@env';

const getStyleRanks = (page, date) => {
  return get(`${API_HOST}/v1/style-ranks`, {
    params: {
      page,
      date,
    },
  });
};

export default getStyleRanks;
