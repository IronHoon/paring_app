import React from 'react';
import MultipleImagesSlide from '../../../atoms/carousel/MultipleImagesSlide';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SwiperRow = (props) => {
  const { userData, postsData, noDataText } = props;
  const userId = userData?.id;
  const navigation = useNavigation();

  function handlePressItem(item) {
    navigation.navigate('SinglePostDetail', {
      screen: 'SinglePostDetail',
      params: {
        feedId: item?.id,
        from: 'othersProfile',
      },
    });
  }

  return (
    <View>
      <MultipleImagesSlide
        noDataText={noDataText}
        userData={userData}
        userId={userId}
        handlePressItem={handlePressItem}
        postsData={postsData}
        title={'othersProfile'}
      />
    </View>
  );
};

export default SwiperRow;
