import React from 'react';
import { deviceWidth } from '../../../atoms/layout/DeviceWidth';
import MultipleImagesSlide from '../../../atoms/carousel/MultipleImagesSlide';
import { useNavigation } from '@react-navigation/native';

const DailySection = ({ posts }) => {
  const navigation = useNavigation();

  function handlePressItem(item) {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        from: 'mainDailyPopular',
      },
    });
  }

  return (
    <MultipleImagesSlide
      handlePressItem={handlePressItem}
      postsData={posts}
      itemHeight={83}
      itemWidth={85}
      sliderHeight={83}
      sliderWidth={deviceWidth}
      title={'dailySection'}
    />
  );
};

export default DailySection;
