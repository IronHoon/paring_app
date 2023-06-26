import get from '../core/get';
import { API_HOST } from '@env';

const getDailyRanks = (page = 1) => {
  return get(`${API_HOST}/v1/daily-ranks`, {
    params: {
      page,
    },
  });
};

export default getDailyRanks;
