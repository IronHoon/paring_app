import React from 'react';
import styled from 'styled-components';

import COLOR from '../../../constants/COLOR';
import { Spacer } from '../layout';

function RoundLabeledInput(props) {
  return (
    <PressableComponent
      hasMargin={props.hasMargin}
      full={props.full}
      {...props}>
      {props.label && (
        <>
          <Label>{props.label}</Label>
          <Spacer width={10} />
        </>
      )}
      <Input {...props} />
    </PressableComponent>
  );
}

const PressableComponent = styled.Pressable`
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  border: 1px solid ${COLOR.BORDER};
  padding-horizontal: 15px;
  ${({ hasMargin }) => (hasMargin ? `margin-bottom:11px;` : ``)}
  ${({ full }) => (full ? `flex:1;` : ``)}
  ${({ disabled }) =>
    disabled
      ? `
    backgroundColor: #eee;
  `
      : ``};
`;

const Component = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  border: 1px solid ${COLOR.BORDER};
  padding-horizontal: 15px;
  ${({ hasMargin }) => (hasMargin ? `margin-bottom:11px;` : ``)}
  ${({ full }) => (full ? `flex:1;` : ``)}
  ${({ disabled }) =>
    disabled
      ? `
    backgroundColor: #eee;
  `
      : ``};
`;

const Input = styled.TextInput`
  height: 28px;
  flex: 1;
  font-size: 14px;
  padding: 0;
  color: rgba(0, 0, 0, 1);
  ${({ disabled }) =>
    disabled
      ? `
    backgroundColor: #eee;
  `
      : ``};
`;

const Label = styled.Text`
  width: 60px;
  font-size: 14px;
  color: rgba(90, 90, 90, 1);
`;

export default RoundLabeledInput;
