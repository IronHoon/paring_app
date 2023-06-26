import React from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import { Pressable } from 'react-native';

import { Icon } from '../../../atoms/image';
import { SpaceBetweenRow } from '../../../atoms/layout';
import MyVoteSlider from './MyVoteSlider';
import { Text } from '../../../atoms/text';
import COLOR from '../../../../constants/COLOR';

const MyVoteItem = ({ score, dataset }) => {
  const { navigate } = useNavigation();
  return (
    <Container>
      <SpaceBetweenRow style={{ marginBottom: 13 }}>
        <ScoreArea>
          <Icon
            size={23}
            source={require('../../../../assets/smallFullStar.png')}
          />
          <Score>{score}</Score>
        </ScoreArea>
        {dataset?.length > 0 && (
          <Pressable
            onPress={() => {
              navigate('MyVoteDetail', {
                params: { score: score },
              });
            }}>
            <MoreText>더보기</MoreText>
          </Pressable>
        )}
      </SpaceBetweenRow>
      <SliderArea>
        {dataset?.length > 0 ? (
          <MyVoteSlider dataset={dataset} />
        ) : (
          <Text
            size={17}
            style={{ color: '#555' }}>
            평가 기록이 없습니다
          </Text>
        )}
      </SliderArea>
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 30px;
`;

const ScoreArea = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Score = styled.Text`
  margin-left: 11px;
  color: #000;
  font-size: 17px;
  letter-spacing: -0.24px;
`;

const SliderArea = styled.View`
  flex-direction: row;
  align-items: center;
  min-height: 112px;
`;

const MoreText = styled.Text`
  color: ${COLOR.PRIMARY};
  font-size: 13px;
  font-weight: bold;
  padding-vertical: 5px;
  padding-horizontal: 10px;
  margin-right: -10px;
`;

export default MyVoteItem;
