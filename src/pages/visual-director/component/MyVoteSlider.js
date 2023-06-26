import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';

const MyVoteSlider = ({ onItemPress = () => {}, dataset, ...props }) => {
  const navigation = useNavigation();

  const RenderItem = ({ item: { post }, index }) => {
    return (
      <PressableOndemandImage
        key={`${post.id}`}
        imgSrc={post?.image}
        width={112}
        height={112}
        borderRadius={12}
        style={{ marginRight: 6 }}
        handlePressItem={() => {
          navigation.navigate('SinglePostDetail', {
            screen: 'SinglePostDetail',
            params: {
              feedId: post?.id,
              from: 'myVote',
            },
          });
        }}
      />
    );
  };

  return (
    <Wrapper style={props.styles?.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={dataset || []}
        renderItem={RenderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.2}
      />
    </Wrapper>
  );
};

const Wrapper = styled.View`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
`;

export default MyVoteSlider;
