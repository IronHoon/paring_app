import React from 'react';
import TitleArea from './TitleArea';
import Spacer from '../../../atoms/layout/Spacer';
import SubTitleArea from './SubtitleArea';
import MultipleImagesSlide from '../../../atoms/carousel/MultipleImagesSlide';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Spinner } from '../../../atoms/image';

const HashOotdSection = ({ posts }) => {
  const navigation = useNavigation();

  function handlePressItem(item) {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        from: 'mainHashOotd',
        posts: posts,
      },
    });
  }

  return (
    <View>
      <TitleArea
        title={"What's HOT"}
        buttonTitle={'더보기'}
        destination={'Ootd'}
      />
      <Spacer height={7} />
      <SubTitleArea subTitle={'이런 스타일은 어때요?'} />
      <Spacer height={7} />
      {posts === null ? (
        <Spinner />
      ) : (
        <MultipleImagesSlide
          handlePressItem={handlePressItem}
          postsData={posts}
          title={'hashOotd'}
        />
      )}
    </View>
  );
};

export default HashOotdSection;
