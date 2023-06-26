import React, { useCallback, useState } from 'react';
import { BackHandler, Text } from 'react-native';
import styled from 'styled-components';
import Carousel from 'react-native-reanimated-carousel';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { deviceHeight, deviceWidth } from '../../../atoms/layout';
import { WhiteSafeArea } from '../../../components/layouts';
import tw from 'twrnc';

const slideData = [
  {
    id: 1,
    title: '스타일을 평가해보세요.',
    description: '스타일을 평가하고 트렌드를 만들어보세요.\n평가만 해도 분석을 받을 수 있어요!',
    image: require('../../../../assets/img_introduction_1.png'),
  },
  {
    id: 2,
    title: '다른 유저의 프로필에 들어가보세요.',
    description: '수만개의 데이터를 분석하여 당신이 입었을때\n해당 유저가 좋아할 룩을 추천해드려요.',
    image: require('../../../../assets/img_introduction_2.png'),
  },
  {
    id: 3,
    title: '오른쪽 하단 매치율을 확인해보세요.',
    description: '다른 유저의 스타일이 얼마나 취향에 맞을지 분석해드려요.\n평가가 늘어날수록 정확도가 높아진답니다.',
    image: require('../../../../assets/img_introduction_3.png'),
  },
  {
    id: 4,
    title: '스타일을 공유해보세요.',
    description:
      '챌린지는 분석을 받거나 평점 랭킹에 도전하고 싶을 때,\nLike는 좋아요로 인기 랭킹에 도전하고 싶을 때 공유해보세요.',
    image: require('../../../../assets/img_introduction_4.png'),
  },
  {
    id: 5,
    title: '비주얼디렉터를 알아볼까요?',
    description:
      '축적된 나의 패션 데이터를 한눈에 확인할 수 있어요.\n카테고리 점수와 이번 주의 최고점 룩도 확인해보세요.',
    image: require('../../../../assets/img_introduction_5.png'),
  },
  {
    id: 6,
    title: '랭킹에  도전해보세요.',
    description: '오로지 유저들의 투표만을 통해 랭킹이 선정됩니다.\n지금 랭킹에 올라 트렌드세터에 도전하세요! ',
    image: require('../../../../assets/img_introduction_6.png'),
  },
];

const onBackPress = () => {
  BackHandler.exitApp();
  return true;
};

const IntroductionPage = () => {
  const navigation = useNavigation();
  const onPressStart = async () => {
    const checked = await AsyncStorage.setItem('check_description', 'checked');
    navigation.navigate('AuthPage', { screen: 'SignIn' });
  };

  const [activeSlide, setActiveSlide] = useState(0);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <WhiteSafeArea>
      <Container source={require('../../../../assets/bg_introduction.png')}>
        <Carousel
          loop={false}
          width={deviceWidth}
          height={deviceHeight}
          autoPlay={false}
          data={slideData}
          scrollAnimationDuration={300}
          onSnapToItem={(index) => setActiveSlide(index)}
          renderItem={Slide}
        />
        <PaginationContainer>
          <Text style={tw`text-black`}>
            {activeSlide + 1} / {slideData.length}
          </Text>
          <ButtonStart
            disabled={activeSlide !== 5}
            onPress={onPressStart}>
            <ButtonStartText disabled={activeSlide !== 5}>시작하기</ButtonStartText>
          </ButtonStart>
        </PaginationContainer>
      </Container>
    </WhiteSafeArea>
  );
};

const Slide = ({ item, index }) => {
  return (
    <SlideContainer>
      <Logo
        resizeMode={'contain'}
        source={require('../../../../assets/introduction_logo.png')}
      />
      <ImageContainer>
        <PhoneImage
          resizeMode={'contain'}
          source={item.image}
        />
      </ImageContainer>
      <TextContainer>
        <Title style={tw`text-black`}>{item.title}</Title>
        <Description>{item.description}</Description>
      </TextContainer>
    </SlideContainer>
  );
};

const Container = styled.ImageBackground`
  flex: 1;
`;
const SlideContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: ${deviceHeight * 0.15}px;
`;
const Logo = styled.Image`
  z-index: 2;
  width: 89px;
  height: 39px;
  margin-top: 48px;
`;
const ImageContainer = styled.View`
  margin-top: -${deviceHeight * 0.696 * 0.01}px;
  align-items: center;
  width: ${deviceWidth}px;
`;
const PhoneImage = styled.Image`
  width: ${deviceHeight * 0.696 * 0.66}px;
  height: ${deviceHeight * 0.696}px;
`;
const PaginationContainer = styled.View`
  position: absolute;
  left: 28px;
  right: 29px;
  bottom: 10px;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const TextContainer = styled.View`
  margin-top: -${deviceHeight * 0.696 * 0.03}px;
`;
const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  letter-spacing: -1.25px;
  text-align: center;
`;

const Description = styled.Text`
  font-size: 14px;
  letter-spacing: -0.95px;
  text-align: center;
`;
const ButtonStart = styled.TouchableOpacity``;
const ButtonStartText = styled.Text`
  font-size: 17px;
  font-weight: bold;
  letter-spacing: -1.36px;
  ${({ disabled }) =>
    disabled
      ? `
    color: #999;
  `
      : `color: #00AFF0`}
`;

export default IntroductionPage;
