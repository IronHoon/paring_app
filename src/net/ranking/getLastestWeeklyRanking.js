import get from '../core/get';
import { API_HOST } from '@env';

const getLatestWeeklyRanking = (page = 1) => {
  return get(`${API_HOST}/v1/latest/weekly-rank`);
};

export default getLatestWeeklyRanking;
