import get from '../core/get';
import { API_HOST } from '@env';

const getWeeklyRankingDetail = (id) => {
  return get(`${API_HOST}/v1/weekly-ranks/${id}`);
};

export default getWeeklyRankingDetail;
