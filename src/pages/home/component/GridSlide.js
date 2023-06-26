import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import { Spinner } from '../../../atoms/image';
import StyleRankRow from './StyleRankRow';
import ThumbnailComponent from './RankingThumbnailComponent';

const Wrapper = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

const InnerWrapper = styled.View`
  width: 100%;
  overflow: hidden;
  flex-wrap: wrap;
  flex-direction: row;
`;

const GridRanking = (props) => {
  const navigation = useNavigation();
  const { activeTab, genderWinnerDate, thumbSize, femaleWinner, maleWinner, thumbMargin } = props;
  const [postData, setPostData] = useState(props.data);

  useEffect(() => {
    let result = props.data;
    if (result?.length > 10) {
      result = result.slice(0, 10);
      setPostData(result);
    }
  }, [props.data]);

  return (
    <View style={{ width: '100%' }}>
      <InnerWrapper>
        {postData?.map?.((item, index) => {
          return (
            <ThumbnailComponent
              key={index.toString()}
              index={index}
              item={item}
              thumbSize={thumbSize}
              thumbMargin={thumbMargin}
              moveToStyleFeed={props.moveToStyleFeed}
              activeTab={activeTab}
            />
          );
        })}
        <ThumbnailComponent
          index={0}
          key={`${femaleWinner?.id}`}
          item={femaleWinner}
          title={'여자랭킹'}
          thumbMargin={thumbMargin}
          thumbSize={thumbSize}
          moveToStyleFeed={props.moveToStyleFeed}
          activeTab={activeTab}
          isGenderRanking={true}
          genderWinnerDate={genderWinnerDate}
          onPress={() => {
            navigation.navigate('Ootd', {
              screen: 'Ootd',
              params: {
                activeTab: 'ranking',
                from: 'home',
                rankingMode: 'WOMAN',
              },
            });
          }}
        />
        <ThumbnailComponent
          index={0}
          key={`${maleWinner?.id}`}
          item={maleWinner}
          title={'남자랭킹'}
          thumbMargin={thumbMargin}
          thumbSize={thumbSize}
          moveToStyleFeed={props.moveToStyleFeed}
          activeTab={activeTab}
          isGenderRanking={true}
          genderWinnerDate={genderWinnerDate}
          onPress={() => {
            navigation.navigate('Ootd', {
              screen: 'Ootd',
              params: {
                activeTab: 'ranking',
                from: 'home',
                rankingMode: 'MAN',
              },
            });
          }}
        />
      </InnerWrapper>
    </View>
  );
};

const StyleRenderItem = (props) => {
  const { postsData, loading, thumbSize, moveToStyleFeed, thumbMargin } = props;

  return (
    <>
      {loading ? (
        <View style={{ height: 500 }}>
          <Spinner />
        </View>
      ) : (
        <>
          <StyleRankRow
            data={postsData?.style1?.items}
            thumbSize={thumbSize}
            thumbMargin={thumbMargin}
            moveToStyleFeed={moveToStyleFeed}
            title={postsData?.style1?.label}
            activeTab={1}
          />
          <StyleRankRow
            data={postsData?.style2?.items}
            thumbSize={thumbSize}
            thumbMargin={thumbMargin}
            moveToStyleFeed={moveToStyleFeed}
            title={postsData?.style2?.label}
            activeTab={1}
          />
          <StyleRankRow
            data={postsData?.style3?.items}
            thumbSize={thumbSize}
            thumbMargin={thumbMargin}
            moveToStyleFeed={moveToStyleFeed}
            title={postsData?.style3?.label}
            activeTab={1}
          />
        </>
      )}
    </>
  );
};

const RenderItem = (props) => {
  const {
    postsData,
    loading,
    activeTab,
    femaleWinner,
    maleWinner,
    thumbSize,
    moveToStyleFeed,
    genderWinnerDate,
    thumbMargin,
  } = props;

  return (
    <View>
      {loading ? (
        <View style={{ height: 500 }}>
          <Spinner />
        </View>
      ) : (
        <GridRanking
          data={postsData}
          thumbSize={thumbSize}
          thumbMargin={thumbMargin}
          moveToStyleFeed={moveToStyleFeed}
          activeTab={activeTab}
          femaleWinner={femaleWinner}
          maleWinner={maleWinner}
          genderWinnerDate={genderWinnerDate}
        />
      )}
    </View>
  );
};

const GridSlide = (props) => {
  const { slideType } = props;
  const navigation = useNavigation();

  const moveToStyleFeed = (item) => {
    navigation.navigate('SinglePostDetail', {
      screen: 'SinglePostDetail',
      params: {
        feedId: item?.id,
        from: 'home',
      },
    });
  };

  return (
    <Wrapper>
      {slideType === 'style' ? (
        <StyleRenderItem
          thumbSize={props.thumbSize}
          moveToStyleFeed={moveToStyleFeed}
          {...props}
        />
      ) : (
        <RenderItem
          thumbSize={props.thumbSize}
          moveToStyleFeed={moveToStyleFeed}
          {...props}
        />
      )}
    </Wrapper>
  );
};

export default GridSlide;
