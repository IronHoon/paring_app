import getPosts from '../net/post/getPosts';
import moment from 'moment';

let Jan = [];
let Feb = [];
let Mar = [];
let Apr = [];
let May = [];
let Jun = [];
let Jul = [];
let Aug = [];
let Sep = [];
let Oct = [];
let Nov = [];
let Dec = [];

const getWeeksRanks = async () => {
  const thisYear = moment().format('YYYY');
  const thisMonth = moment().format('MM');
  const thisDay = moment().format('DD');
  // moment js 예시 : 오늘 날짜에 대한 분할정보

  if (
    Jan.length !== 0 ||
    Feb.length !== 0 ||
    Mar.length !== 0 ||
    Apr.length !== 0 ||
    May.length !== 0 ||
    Jun.length !== 0 ||
    Jul.length !== 0 ||
    Aug.length !== 0 ||
    Sep.length !== 0 ||
    Oct.length !== 0 ||
    Nov.length !== 0 ||
    Dec.length !== 0
  ) {
    return { calendar: { Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec } };
  } else {
    for (let week = 1; week < 54; week++) {
      const startDate = moment(week, 'W').format('YYYY-MM-DD');
      const whichMonth = moment(week, 'W').format('MMM'); //Jan, Feb ...

      let maleWinner;
      let femaleWinner;
      try {
        const maleResponse = await getPosts(1, '', {
          order: 'rate',
          startDate: startDate,
          endDate: moment(startDate, 'YYYY-MM-DD').add(7, 'days').format('YYYY-MM-DD'),
          gender_id: 1,
        });

        const femaleResponse = await getPosts(1, '', {
          order: 'rate',
          startDate: startDate,
          endDate: moment(startDate, 'YYYY-MM-DD').add(7, 'days').format('YYYY-MM-DD'),
          gender_id: 2,
        });

        maleWinner = maleResponse[0]?.data;
        femaleWinner = femaleResponse[0]?.data;

        switch (whichMonth) {
          case 'Jan':
            Jan.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'Feb':
            Feb.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'Mar':
            Mar.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'Apr':
            Apr.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'May':
            May.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'Jun':
            Jun.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'Jul':
            Jul.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'Aug':
            Aug.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'Sep':
            Sep.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'Oct':
            Oct.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'Nov':
            Nov.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          case 'Dec':
            Dec.push({ week: week, female: femaleWinner, male: maleWinner });
            break;
          default:
            console.warn(`Sorry, it is out of range.`);
        }
      } catch (error) {
        console.warn(error);
      }
    }

    return { calendar: { Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec } };
  }
};

export default getWeeksRanks;
