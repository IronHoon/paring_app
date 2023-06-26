import React from 'react';

function visualCategoryData(data, setCategoryData) {
  setCategoryData([
    {
      label: '스타일',
      data: [
        {
          name: '모던',
          icon: require('../../../../assets/style/style_modern.png'),
          score: data?.averages?.styles[0]?.value,
        },
        {
          name: '캐주얼',
          icon: require('../../../../assets/style/style_casual.png'),
          score: data?.averages?.styles[1]?.value,
        },
        {
          name: '스트릿',
          icon: require('../../../../assets/style/style_street.png'),
          score: data?.averages?.styles[2]?.value,
        },
        {
          name: '기 타',
          icon: require('../../../../assets/style/etc.png'),
          score: data?.averages?.styles[3]?.value,
          size: 40,
        },
      ],
    },
    {
      label: '아우터',
      data: [
        {
          name: '코 트',
          icon: require('../../../../assets/style/outer_coat.png'),
          score: data?.averages?.outers[0]?.value,
        },
        {
          name: '수트 / 블레이져',
          icon: require('../../../../assets/style/outer_suit.png'),
          score: data?.averages?.outers[1]?.value,
        },
        {
          name: '재 킷',
          icon: require('../../../../assets/style/outer_jacket.png'),
          score: data?.averages?.outers[2]?.value,
        },
        {
          name: '패 딩',
          icon: require('../../../../assets/style/outer_padding.png'),
          score: data?.averages?.outers[3]?.value,
        },
        {
          name: '기 타',
          icon: require('../../../../assets/style/etc.png'),
          score: data?.averages?.outers[4]?.value,
          size: 40,
        },
      ],
    },
    {
      label: '상  의',
      data: [
        {
          name: '셔츠 / 블라우스',
          icon: require('../../../../assets/style/top_shirts.png'),
          score: data?.averages?.tops[0]?.value,
        },
        {
          name: '맨투맨',
          icon: require('../../../../assets/style/top_mtm.png'),
          score: data?.averages?.tops[1]?.value,
        },
        {
          name: '니트웨어',
          icon: require('../../../../assets/style/top_kneet.png'),
          score: data?.averages?.tops[2]?.value,
        },
        {
          name: '티셔츠',
          icon: require('../../../../assets/style/top_tshirts.png'),
          score: data?.averages?.tops[3]?.value,
        },
        {
          name: '후 드',
          icon: require('../../../../assets/style/top_hood.png'),
          score: data?.averages?.tops[4]?.value,
        },
        {
          femaleOnly: true,
          name: '원피스',
          icon: require('../../../../assets/style/top_onepiece.png'),
          score: data?.averages?.tops[5]?.value,
        },
        {
          name: '기 타',
          icon: require('../../../../assets/style/etc.png'),
          score: data?.averages?.tops[6]?.value,
          size: 40,
        },
      ],
    },
    {
      label: '하  의',
      data: [
        {
          name: '데 님',
          icon: require('../../../../assets/style/bottom_denim.png'),
          score: data?.averages?.bottoms[0]?.value,
        },
        {
          name: '슬랙스 / 수트',
          icon: require('../../../../assets/style/bottom_slacks.png'),
          score: data?.averages?.bottoms[1]?.value,
        },
        {
          name: '코튼팬츠',
          icon: require('../../../../assets/style/bottom_cotton.png'),
          score: data?.averages?.bottoms[2]?.value,
        },
        {
          name: '숏',
          icon: require('../../../../assets/style/bottom_shorts.png'),
          score: data?.averages?.bottoms[3]?.value,
        },
        {
          name: '조거 / 트레이닝',
          icon: require('../../../../assets/style/bottom_jogger.png'),
          score: data?.averages?.bottoms[4]?.value,
        },
        {
          femaleOnly: false,
          name: '스커트',
          icon: require('../../../../assets/style/bottom_skirts.png'),
          score: data?.averages?.bottoms[5]?.value,
        },
        {
          name: '기 타',
          icon: require('../../../../assets/style/etc.png'),
          score: data?.averages?.bottoms[6]?.value,
          size: 40,
        },
      ],
    },
  ]);
}

export default visualCategoryData;
