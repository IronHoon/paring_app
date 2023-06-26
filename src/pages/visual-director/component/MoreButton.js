import React from 'react';
import styled from 'styled-components';

const MoreButton = (props) => {
  return (
    <Component {...props}>
      <ButtonMoreText>{props.fold ? '더보기' : '접기'}</ButtonMoreText>
    </Component>
  );
};

const Component = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: 32px;
  border-radius: 10px;
  border-color: rgb(220, 220, 220);
  border-width: 1px;
`;
const ButtonMoreText = styled.Text`
  font-size: 14px;
`;

export default MoreButton;
