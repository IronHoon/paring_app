import moment from 'moment';

const weekOfMonth = (m) => {
  const value = m.week() - moment(m).startOf('month').week() + 1;

  if (value < 0) {
    return 5;
  } else {
    return value;
  }
};

export default weekOfMonth;
