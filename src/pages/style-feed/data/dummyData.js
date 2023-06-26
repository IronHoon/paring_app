const feedList = [
  {
    id: 1,
    userId: 1111,
    star: 4.3,
    menStar: 4,
    womenStar: 4.6,
    teenStar: 4.01,
    twentyStar: 3.01,
    type: 'Daily',
  },
  {
    id: 2,
    userId: 22222,
    star: 3,
    menStar: 2,
    womenStar: 4,
    teenStar: 4.01,
    twentyStar: 3.01,
    type: 'Daily',
  },
  {
    id: 3,
    userId: 1111,
    star: 4.3,
    menStar: 4,
    womenStar: 4.6,
    teenStar: 4.01,
    twentyStar: 3.01,
    type: 'Challenge',
  },
  {
    id: 4,
    userId: 4444,
    star: 4.3,
    menStar: 4,
    womenStar: 4.6,
    teenStar: 4.01,
    twentyStar: 3.01,
    type: 'Challenge',
  },
  {
    id: 5,
    userId: 55555,
    star: 4.3,
    menStar: 4,
    womenStar: 4.6,
    teenStar: 4.01,
    twentyStar: 3.01,
    type: 'Daily',
  },
];

const challengeList = feedList.filter((data) => {
  return data.type === 'Challenge';
});

const dailyList = feedList.filter((data) => {
  return data.type === 'Daily';
});

const categories = [
  {
    id: 1,
    name: '맨투맨',
  },
  {
    id: 2,
    name: '데님팬츠',
  },
];

const comments = [
  {
    id: 1,
    userId: 1111,
    createdAt: '2020-11-27 00:00:00',
    content: 'hi',
  },
  {
    id: 2,
    userId: 22222,
    createdAt: '2020-11-27 01:00:00',
    content:
      'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },
  {
    id: 3,
    userId: 1111,
    createdAt: '2020-11-27 02:00:00',
    content: 'como hablas tu',
  },
  {
    id: 4,
    userId: 1111,
    createdAt: '2020-11-27 01:00:00',
    content:
      'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },
  {
    id: 5,
    userId: 3333,
    createdAt: '2020-11-27 01:00:00',
    content:
      'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },
];

export { feedList, challengeList, dailyList, categories, comments };
