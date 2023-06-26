import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  SmallEmptyStarBlack,
  SmallFullStarBlack,
  SmallFullStarGreen,
  SmallFullStarRed,
  SmallHalfStarBlack,
  SmallHalfStarGreen,
  SmallHalfStarRed,
} from '../../atoms/Icons';
import { Spacer } from '../../../../atoms/layout';

const StatisticsStars = (props) => {
  const { feed, gender, star } = props;
  if (gender === 'female') {
    return (
      <Stars
        star={star}
        halfSrc={SmallHalfStarRed}
        emptySrc={SmallEmptyStarBlack}
        fullSrc={SmallFullStarRed}
      />
    );
  }
  if (gender === 'male') {
    return (
      <Stars
        star={star}
        halfSrc={SmallHalfStarGreen}
        emptySrc={SmallEmptyStarBlack}
        fullSrc={SmallFullStarGreen}
      />
    );
  } else {
    return (
      <Stars
        star={star}
        halfSrc={SmallHalfStarBlack}
        emptySrc={SmallEmptyStarBlack}
        fullSrc={SmallFullStarBlack}
      />
    );
  }
};

const Stars = ({ star, halfSrc, emptySrc, fullSrc }) => {
  return (
    <View
      style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        style={styles.star}
        source={star >= 0.5 ? (star >= 1 ? fullSrc : halfSrc) : emptySrc}
      />
      <Spacer width={3} />
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        style={styles.star}
        source={star >= 1.5 ? (star >= 2 ? fullSrc : halfSrc) : emptySrc}
      />
      <Spacer width={3} />

      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        style={styles.star}
        source={star >= 2.5 ? (star >= 3 ? fullSrc : halfSrc) : emptySrc}
      />
      <Spacer width={3} />

      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        style={styles.star}
        source={star >= 3.5 ? (star >= 4 ? fullSrc : halfSrc) : emptySrc}
      />
      <Spacer width={3} />

      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        style={styles.star}
        source={star >= 4.5 ? (star >= 5 ? fullSrc : halfSrc) : emptySrc}
      />
    </View>
  );
};

const styles = {
  star: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
    flexShrink: 0,
  },
};

export default StatisticsStars;
