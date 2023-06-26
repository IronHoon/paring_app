import React from 'react';
import TitleArea from './TitleArea';
import Spacer from '../../../atoms/layout/Spacer';
import SubTitleArea from './SubtitleArea';
import MultipleImagesSlide from '../../../atoms/carousel/MultipleImagesSlide';
import { View } from 'react-native';
import { Icon } from '../../../atoms/image';
import { useNavigation } from '@react-navigation/native';

const OotdIndexSection = ({ posts }) => {
  const navigation = useNavigation();

  function handlePressItem(item) {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        posts: posts,
        from: 'mainOotdIndex',
      },
    });
  }

  return (
    <View>
      <TitleArea
        title={'페어링 지수'}
        titleIcon={
          <Icon
            source={require('../../../../assets/iconLogoBlack.png')}
            size={20}
          />
        }
        buttonTitle={'VISUAL DIRECTOR'}
        destination={'VisualDirector'}
      />
      <Spacer height={7} />
      <SubTitleArea subTitle={'빅데이터를 통해 나에게 어울리는 동성의 패션 / 내가 좋아할 이성의 패션 분석!'} />
      <Spacer height={7} />
      <MultipleImagesSlide
        postsData={posts}
        title={'ootdIndex'}
        handlePressItem={handlePressItem}
      />
    </View>
  );
};

export default OotdIndexSection;
