import React from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import { Spacer } from '../../../atoms/layout';
import PressableOndemandImage from '../../../atoms/image/PressableOndemandImage';

const WeeklyBestItem = ({ feed, thumb, title, score }) => {
  const navigation = useNavigation();

  if (score <= 0) {
    return (
      <Container onPress={() => {}}>
        <PressableOndemandImage
          imgSrc={null}
          defaultImg={require('../../../../assets/defaultProfileImage.png')}
          width={66}
          height={66}
          borderRadius={33}
          style={{ marginHorizontal: 16 }}
        />
        <TextArea>
          <Title>{title}</Title>
          <Spacer size={4} />
          <ScoreArea>
            <Dot />
            <ScoreText>
              평점
              <Spacer width={9} />-
            </ScoreText>
          </ScoreArea>
        </TextArea>
      </Container>
    );
  }
  return (
    <Container
      onPress={() => {
        navigation.navigate('SinglePostDetail', {
          screen: 'SinglePostDetail',
          params: {
            feedId: feed?.id,
            from: 'weekly',
          },
        });
      }}>
      <PressableOndemandImage
        imgSrc={thumb}
        defaultImg={require('../../../../assets/defaultProfileImage.png')}
        width={66}
        height={66}
        borderRadius={33}
        style={{ marginHorizontal: 16 }}
      />
      <TextArea>
        <Title>{title}</Title>
        <Spacer size={4} />
        <ScoreArea>
          <Dot />
          <ScoreText>
            평점
            <Spacer width={9} />
            {score || '-'}
          </ScoreText>
        </ScoreArea>
      </TextArea>
    </Container>
  );
};

const Container = styled.Pressable`
  flex-direction: row;
  align-items: center;
  margin-bottom: 25px;
`;

const TextArea = styled.View`
  flex: 1;
`;
const Title = styled.Text`
  color: #000;
  font-size: 17px;
  letter-spacing: -0.24px;
`;

const ScoreArea = styled.View`
  flex-direction: row;
  align-items: center;
`;
const ScoreText = styled.Text`
  letter-spacing: -0.32px;
  font-size: 10px;
  color: #000;
  font-weight: bold;
`;
const Dot = styled.View`
  top: 1px;
  width: 4px;
  height: 4px;
  margin-right: 5px;
  background-color: rgb(24, 156, 196);
`;

export default WeeklyBestItem;
