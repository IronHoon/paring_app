import React from 'react';
import styled from 'styled-components/native';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Row, Spacer } from '../../../atoms/layout';
import { withContext } from 'context-q';

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 19px;
`;

const TitleText = styled.Text`
  font-size: 17px;
  line-height: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
`;

const ButtonText = styled.Text`
  color: rgba(0, 175, 240, 1);
  font-size: 13px;
`;

let TitleArea = (props) => {
  const navigation = useNavigation();
  const { category } = props;

  return (
    <Wrapper>
      <Row centered>
        {props.titleIcon && (
          <>
            {props.titleIcon}
            <Spacer width={2} />
          </>
        )}
        <TitleText>{props.title}</TitleText>
      </Row>
      <Pressable
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        onPress={() => {
          if (props.destination === 'Ootd') {
            navigation.navigate(props.destination, {
              screen: props.destination,
              params: { activeTab: 'search', category: category },
            });
          } else if (props.destination === 'VisualDirector') {
            navigation.navigate('VisualDirector', {
              screen: 'VisualDirector',
              params: { back: false },
            });
          } else {
            navigation.navigate(props.destination);
          }
        }}>
        <ButtonText>{props.buttonTitle}</ButtonText>
      </Pressable>
    </Wrapper>
  );
};
TitleArea = withContext(TitleArea);
export default TitleArea;
