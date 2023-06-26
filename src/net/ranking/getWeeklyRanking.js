import get from '../core/get';
import { API_HOST } from '@env';

const getWeeklyRanking = (page = 1) => {
  return get(`${API_HOST}/v1/weekly-ranks`, {
    params: {
      page,
    },
  });
};

export default getWeeklyRanking;
