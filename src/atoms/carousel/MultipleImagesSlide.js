import React from 'react';
import { FlatList, View } from 'react-native';

import styled from 'styled-components/native';
import { Spinner } from '../image';
import { Text } from '../text';
import PressableOndemandImage from '../image/PressableOndemandImage';
import { getResizePath } from '../../utils';

const Wrapper = styled.View`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  padding: 0 16px;
`;

const NameText = styled.Text`
  color: rgba(0, 0, 0, 1);
  font-size: 13px;
  text-align: center;
  margin-top: 4px;
`;

const IndexTextWrapper = styled.View`
  position: absolute;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  bottom: 10px;
  width: 90%;
  margin-left: 5%;
`;

const IndexText = styled.Text`
  color: #fff;
  text-align: center;
  margin: 0 auto;
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

// 텍스트영역 렌더 분기
function RenderText(props) {
  const { title, itemHeight, item } = props;
  switch (title) {
    case 'othersProfile':
      return <></>;
    case 'product':
      return <></>;
    case 'ootdIndex':
      let idx = item?.pairing ? Math.ceil(item?.pairing * 100) : '-';
      return (
        <IndexTextWrapper itemHeight={itemHeight}>
          <IndexText>{idx}% 일치</IndexText>
        </IndexTextWrapper>
      );
    case 'dailySection':
      return <NameText numberOfLines={1}>{item?.user?.name} </NameText>;
    case 'hashOotd':
      return <NameText numberOfLines={1}>{item?.user?.name} </NameText>;
    default:
      return <NameText numberOfLines={1}>{item?.title || item?.content} </NameText>;
  }
}

const MultipleImagesSlide = (props) => {
  const { itemWidth, itemHeight, sliderHeight, noDataText, title, postsData = [], handlePressItem } = props;

  const RenderItem = ({ item, index }) => {
    return (
      <View
        key={index.toString()}
        style={{
          width: itemWidth || 112,
          marginRight: 6,
        }}>
        <View
          onPress={() => {
            handlePressItem(item);
          }}>
          {title === 'othersProfile' && <RankText rank={index + 1} />}
          <PressableOndemandImage
            handlePressItem={() => {
              handlePressItem(item);
            }}
            imgSrc={getResizePath(item?.image, itemWidth * 2 || 224, itemWidth * 2 || 224)}
            borderRadius={12}
            width={itemWidth || 112}
            height={itemHeight || 112}
          />
        </View>

        <RenderText
          title={title}
          itemHeight={itemHeight}
          item={item}
        />
      </View>
    );
  };
  return (
    <Wrapper>
      <>
        {postsData === null ? (
          <Spinner />
        ) : (
          <>
            {postsData?.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={(item, index) => `${index}_${item.id}`}
                data={postsData}
                renderItem={RenderItem}
                onEndReachedThreshold={0.2}
              />
            ) : (
              <View
                style={{
                  height: 30,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
                  {noDataText || '게시물이 없습니다.'}
                </Text>
              </View>
            )}
          </>
        )}
      </>
    </Wrapper>
  );
};

export default MultipleImagesSlide;
