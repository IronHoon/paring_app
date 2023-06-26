import React, { useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components';
import { Pressable, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

import { SmallEmptyStarBlack, SmallFullStar, SmallHalfStar } from '../../atoms/Icons';
import patchRating from '../../../../net/rating/patchRating';
import { Spacer } from '../../../../atoms/layout';

const Container = styled.View``;
const StarComponent = styled.View``;
const StarPressButton = styled.Pressable`
  position: absolute;
  top: 0;
  width: 22px;
  height: 44px;
`;
const LoadingIndicator = styled.View`
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 70px;

  opacity: 0.7;
`;

const VoteStar = (props) => {
  const { feed } = props;
  const [score, setScore] = useState(props.score);
  const [patchedScore, setPatchedScore] = useState(props.score);
  const [loading, setLoading] = useState(false);
  const [touching, setTouching] = useState(false);

  const initLoading = () => {
    setLoading(false);
    setTouching(false);
  };

  useEffect(() => {
    return () => {
      initLoading();
    };
  }, []);

  useEffect(() => {
    setScore(props.score);
    setPatchedScore(props.score);
  }, [props.score]);

  useEffect(() => {
    const timer = setTimeout(() => {
      (async function () {
        try {
          if (!loading && touching && score && feed?.id) {
            setLoading(true);
            let response = await patchRating(feed?.id, score);
            setPatchedScore(score);
            initLoading();
          }
        } catch (error) {
          initLoading();
          console.warn(error.response);
        }
      })();
    }, 500);
    return () => {
      setTouching(false);
      clearTimeout(timer);
    };
  }, [score]);

  const onPressStar = async (v) => {
    try {
      if (v !== patchedScore) {
        setTouching(true);
        setScore(v);
      }
    } catch (error) {
      initLoading();
      console.warn(error.response);
    }
  };

  const onDragStar = (event) => {
    setTouching(true);
    const position = event.nativeEvent.absoluteX;
    let _score = getScoreWithDragPosition(position);
    if (_score !== patchedScore) {
      _score && setScore(_score);
    }
  };

  return (
    <Container>
      <PanGestureHandler onGestureEvent={onDragStar}>
        <View
          style={{
            marginTop: 14,
            height: 40,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
          }}>
          <Pressable
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              left: 10,
              right: 10,
              zIndex: 100,
              backgroundColor: '#fff',
            }}>
            <Star
              score={score}
              value={1}
              onPressStar={onPressStar}
            />
            <Spacer size={20} />
            <Star
              score={score}
              value={2}
              onPressStar={onPressStar}
            />
            <Spacer size={20} />
            <Star
              score={score}
              value={3}
              onPressStar={onPressStar}
            />
            <Spacer size={20} />
            <Star
              score={score}
              value={4}
              onPressStar={onPressStar}
            />
            <Spacer size={20} />
            <Star
              score={score}
              value={5}
              onPressStar={onPressStar}
            />
          </Pressable>
        </View>
      </PanGestureHandler>
      {/*{*/}
      {/*  (loading) && (*/}
      {/*    <LoadingIndicator>*/}
      {/*      <Spinner*/}
      {/*        style={{ minHeight:50 }}*/}
      {/*      />*/}
      {/*    </LoadingIndicator>*/}
      {/*  )*/}
      {/*}*/}
    </Container>
  );
};

const getScoreWithDragPosition = (position) => {
  let score = null;
  if (position < 60) {
    score = 0;
  } else if (position >= 60 && position < 90) {
    score = 0.5;
  } else if (position >= 90 && position < 120) {
    score = 1;
  } else if (position >= 120 && position < 150) {
    score = 1.5;
  } else if (position >= 150 && position < 180) score = 2;
  else if (position >= 180 && position < 210) score = 2.5;
  else if (position >= 210 && position < 240) score = 3;
  else if (position >= 240 && position < 270) score = 3.5;
  else if (position >= 270 && position < 300) score = 4;
  else if (position >= 300 && position < 330) score = 4.5;
  else {
    score = 5;
  }
  return score;
};

const Star = (props) => {
  const { score, value, onPressStar } = props;
  return (
    <>
      <StarComponent>
        <FastImage
          style={{ height: 44, width: 44 }}
          resizeMode={FastImage.resizeMode.contain}
          source={
            score === 0
              ? SmallEmptyStarBlack
              : score === 5
              ? SmallFullStar
              : value <= score
              ? SmallFullStar
              : value === score + 0.5
              ? SmallHalfStar
              : SmallEmptyStarBlack
          }
        />
        <StarPressButton
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 0 }}
          style={{ left: 0 }}
          onPress={() => {
            onPressStar(value - 0.5);
          }}
        />
        <StarPressButton
          hitSlop={{ top: 10, left: 0, bottom: 10, right: 10 }}
          style={{ right: 0 }}
          onPress={() => {
            onPressStar(value);
          }}
        />
      </StarComponent>
    </>
  );
};

export default VoteStar;
