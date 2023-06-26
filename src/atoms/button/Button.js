import React from 'react';
import styled from 'styled-components';

import COLOR from '../../../constants/COLOR';
import { Spacer } from '../layout';

function Button({ bold, children, disabled, fontColor, fontSize, full, iconComponent, styles = {}, ...props }) {
  return (
    <Component
      {...props}
      style={{ ...styles?.container }}
      disabled={disabled}
      full={full}>
      {iconComponent && (
        <>
          {iconComponent}
          <Spacer
            width={16}
            style={{ ...styles?.iconSpacer }}
          />
        </>
      )}
      <ButtonText
        bold={bold}
        disabled={disabled}
        fontColor={fontColor}
        fontSize={fontSize}
        style={{ ...styles?.font }}>
        {children}
      </ButtonText>
    </Component>
  );
}

const Component = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.buttonHeight ? props.buttonHeight : '40px')};
  padding-horizontal: 14px;
  border-radius: 8px;
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : COLOR.PRIMARY)};
  border-color: ${(props) => (props.borderColor ? props.borderColor : 'transparent')};
  border-width: ${(props) => (props.borderColor ? '1px' : 0)};
  ${({ disabled }) => (disabled ? `background-color:#ccc;border-color:#ccc` : ``)}
  ${({ full }) => (full ? `flex:1` : ``)};

  ${({ disabled }) =>
    disabled
      ? `
    background-color: #ccc;
    border-color: #ccc;
  `
      : ``}
`;

const ButtonText = styled.Text`
  color: ${({ fontColor }) => (fontColor ? fontColor : '#fff')};
  text-align: center;
  font-size: ${({ fontSize }) => (fontSize ? fontSize + 'px' : '17px')};
  letter-spacing: -0.42px;

  ${({ disabled }) =>
    disabled
      ? `
    color:#fff;
  `
      : ``}

  ${({ bold }) =>
    bold
      ? `
    font-weight:bold;
  `
      : ``}
`;

export default Button;
