import React from 'react';
import { Pressable, View } from 'react-native';
import styled from 'styled-components/native/dist/styled-components.native.esm';

import { Text } from '../../../atoms/text';
import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';
import { getResizePath } from '../../../utils';

const ThumbnailComponent = (props) => {
  const { index, thumbSize, onPress, title, moveToStyleFeed, item, isGenderRanking, genderWinnerDate } = props;
  let rank = null;
  if (index !== undefined) {
    rank = index + 1;
  }

  return (
    <Pressable
      onPress={() => {
        onPress ? onPress() : moveToStyleFeed(item);
      }}
      style={{ width: '33.3333%', padding: 2 }}>
      {isGenderRanking ? (
        <ThumbSquare thumbSize={thumbSize - 4 + 'px'}>
          <BlackSquare />
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
            }}>
            <FirstRankTitle
              type={'week'}
              text={genderWinnerDate ? `${genderWinnerDate?.month}월 ${genderWinnerDate?.weekNo}주차` : `주차`}
            />
            <FirstRankTitle
              type={'gender'}
              text={title}
            />
          </View>
          <PressableOndemandImage
            imgSrc={`${item?.image}?w=${thumbSize * 2}&h=${thumbSize * 2}`}
            handlePressItem={() => {
              moveToStyleFeed(item);
            }}
          />
        </ThumbSquare>
      ) : (
        <>
          <ThumbSquare thumbSize={thumbSize - 4 + 'px'}>
            <PressableOndemandImage
              imgSrc={getResizePath(item?.image, thumbSize * 2, thumbSize * 2)}
              handlePressItem={() => {
                moveToStyleFeed(item);
              }}
            />
          </ThumbSquare>
          {rank && <RankText rank={rank} />}
        </>
      )}
    </Pressable>
  );
};

const FirstRankTitle = (props) => {
  return (
    <View>
      <Text
        size={13}
        style={{ color: '#fff', fontWeight: 'bold' }}>
        {props.text}
      </Text>
    </View>
  );
};

// 썸네일 위의 검정색 마스킹

const BlackSquare = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 2;
  border-radius: 14px;
  overflow: hidden;
  background-color: rgba(21, 21, 21, 0.55);
`;

// 썸네일 네모 스타일

const ThumbSquare = styled.View`
  position: relative;
  width: 100%;
  height: ${(props) => props.thumbSize};
  border-radius: 14px;
  overflow: hidden;
`;

// RankText

const RankText = (props) => {
  return (
    <View style={{ position: 'absolute', zIndex: 99, top: 10, left: 10 }}>
      <Text
        size={13}
        style={{
          color: '#fff',
          fontWeight: 'bold',
          textShadowColor: 'rgba(0,0,0,1)',
          textShadowRadius: 1,
        }}>
        {props.rank}
      </Text>
    </View>
  );
};

export default ThumbnailComponent;
