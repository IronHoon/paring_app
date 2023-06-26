import React from 'react';
import styled from 'styled-components';
import COLOR from '../../../constants/COLOR';

function SmallButton(props) {
  const styles = props.styles || {};

  return (
    <Component
      {...props}
      style={{ ...styles?.container }}
      type={props.type}
      disabled={props.disabled}>
      <ButtonText
        style={{ ...styles?.font }}
        type={props.type}>
        {props.children}
      </ButtonText>
    </Component>
  );
}

const Component = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  min-width: 70px;
  height: 24px;
  padding-horizontal: 8px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ type }) => {
    switch (type) {
      case 'gray':
        return `rgba(210,210,210,1)`;
      case 'border_primary':
        return COLOR.PRIMARY;
      default:
        return COLOR.PRIMARY;
    }
  }};
  background-color: ${({ type }) => {
    switch (type) {
      case 'gray':
        return `rgba(210,210,210,1)`;
      case 'border_primary':
        return '#fff';
      default:
        return COLOR.PRIMARY;
    }
  }};
  ${({ disabled }) => (disabled ? `background-color:#ccc;border-color:#ccc` : ``)}
`;

const ButtonText = styled.Text`
  font-size: 14px;
  letter-spacing: -0.35px;
  text-align: center;
  color: ${({ type }) => {
    switch (type) {
      case 'gray':
        return `rgba(78,78,78,1)`;
      case 'border_primary':
        return COLOR.PRIMARY;
      default:
        return '#fff';
    }
  }};
`;

export default SmallButton;
