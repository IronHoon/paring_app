import React from 'react';
import styled from 'styled-components';
import COLOR from '../../../constants/COLOR';

const LabeledInput = (props) => {
  return (
    <LabeledInputComponent style={props.style || {}}>
      <Label>{props.label}</Label>
      <Input
        autoCapitalize='none'
        autoCorrect={false}
        editable={!props.disabled}
        {...props}
      />
    </LabeledInputComponent>
  );
};

const LabeledInputComponent = styled.View`
  margin-bottom: 22px;
`;

const Input = styled.TextInput`
  height: 22px;
  padding: 0;
  margin-top: 12px;
  border-bottom-width: 1px;
  border-color: ${COLOR.BORDER};
  font-size: 13px;
  line-height: 13px;
  color: #000;
  ${({ editable }) =>
    editable
      ? `
  `
      : `
    color:#999;
    `}
`;

const Label = styled.Text`
  font-size: 13px;
  color: rgba(168, 168, 168, 1);
`;
export default LabeledInput;
