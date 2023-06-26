import React from 'react';
import { deviceWidth } from '../../../atoms/layout/DeviceWidth';
import MultipleImagesSlide from '../../../atoms/carousel/MultipleImagesSlide';
import { useNavigation } from '@react-navigation/native';

const CategorySection = (props) => {
  const { to, posts } = props;
  const navigation = useNavigation();

  function handlePressItem(item) {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        from: to,
      },
    });
  }

  return (
    <MultipleImagesSlide
      handlePressItem={handlePressItem}
      postsData={posts}
      itemHeight={131}
      itemWidth={163}
      sliderHeight={131}
      sliderWidth={deviceWidth}
    />
  );
};

export default CategorySection;
