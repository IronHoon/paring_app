import moment from 'moment';

export function getRelationalTime(dateString: string) {
  const date = moment(dateString, 'YYYY-MM-DD HH:mm:ss');
  const diffInMs = moment().diff(date);
  const duration = moment.duration(diffInMs);

  if (duration.asSeconds() < 60) {
    return '방금 전';
  } else if (duration.asMinutes() < 60) {
    return `${Math.floor(duration.asMinutes())}분 전`;
  } else if (duration.asHours() < 24) {
    return `${Math.floor(duration.asHours())}시간 전`;
  } else if (duration.asDays() < 7) {
    return `${Math.floor(duration.asDays())}일 전`;
  } else {
    return moment.utc(dateString).local().format('YYYY년 M월 D일');
  }
}
