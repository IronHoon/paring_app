import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { Linking, Pressable, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import styled from 'styled-components/native';
import { deviceWidth } from '../layout';

const isValidUrl = (url) => {
  const httpPattern = RegExp('^http://.*');
  const httpsPattern = RegExp('^https://.*');
  const wwwPattern = RegExp('^www\\..*');

  if (httpPattern.test(url) || httpsPattern.test(url)) {
    return url;
  } else if (wwwPattern.test(url)) {
    return 'https://' + url;
  } else {
    return false;
  }
};

const Wrapper = styled.View`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const renderItem = ({ item, index }) => {
  return (
    <View style={{ height: 113 }}>
      <Pressable
        onPress={() => {
          let url = item?.href;
          if (url && isValidUrl(url)) {
            Linking.openURL(isValidUrl(url));
          }
        }}>
        <FastImage
          source={{ uri: item.path }}
          style={{ width: '100%', height: '100%' }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </Pressable>
    </View>
  );
};

const FullWidthSlide = (props) => {
  return (
    <Wrapper>
      {props.data && (
        <Carousel
          loop
          width={deviceWidth}
          height={113}
          autoPlay={true}
          data={props.data || []}
          scrollAnimationDuration={1000}
          autoPlayInterval={4000}
          // onSnapToItem={(index) => setActiveSlide(index)}
          renderItem={renderItem}
        />
        // <Carousel
        //   data={props.data || []}
        //   renderItem={renderItem}
        //   sliderWidth={deviceWidth}
        //   itemWidth={deviceWidth}
        //   itemHeight={113}
        //   loop={true}
        //   autoplay={true}
        //   autoplayDelay={1000}
        //   autoplayInterval={4000}
        //   activeSlideAlignment={'start'}
        // />
      )}
    </Wrapper>
  );
};

export default FullWidthSlide;
