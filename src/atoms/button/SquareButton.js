import React from 'react';
import styled from 'styled-components';

import COLOR from '../../../constants/COLOR';

function SquareButton(props) {
  const styles = props.styles || {};

  return (
    <Component
      {...props}
      style={{ ...styles?.container }}
      disabled={props.disabled}>
      <ButtonText
        {...props}
        style={{ ...styles?.font }}>
        {props.children}
      </ButtonText>
    </Component>
  );
}

const Component = styled.Pressable`
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.buttonHeight ? props.buttonHeight : '73px')};
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : COLOR.PRIMARY)};
  ${({ disabled }) => (disabled ? `background-color:#ccc; border-color:#ccc` : ``)}
`;

const ButtonText = styled.Text`
  color: ${(props) => (props.fontColor ? props.fontColor : '#fff')};
  text-align: center;
  font-size: 25px;
  letter-spacing: -0.62px;
`;

export default SquareButton;
