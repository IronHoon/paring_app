import React from 'react';
import styled from 'styled-components/native';
import VisualImage from './VisualImage';
import { Icon } from '../../../atoms/image';
import { Spacer } from '../../../atoms/layout';

const VisualSection = ({ source, star }) => {
  return (
    <Container>
      <VisualImage source={source} />
      <StarArea>
        <Icon
          source={require('../../../../assets/bigFullStar_fit.png')}
          size={24}
        />
        <Spacer width={8} />
        <StarText>{star}</StarText>
      </StarArea>
    </Container>
  );
};

const Container = styled.View`
  position: relative;
`;

const StarArea = styled.View`
  position: absolute;
  flex-direction: row;
  align-items: center;
  bottom: 9px;
  left: 8px;
  border-radius: 10px;
  padding-horizontal: 10px;
  padding-vertical: 5px;
  background-color: rgba(27, 27, 27, 0.75);
`;
const StarText = styled.Text`
  color: #fff;
  font-size: 21px;
  letter-spacing: -0.52px;
  font-weight: bold;
`;

export default VisualSection;
