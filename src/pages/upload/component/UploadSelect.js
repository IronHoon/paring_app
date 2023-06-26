import React from 'react';
import { Select } from '../../../atoms/form';
import styled from 'styled-components/native';
import COLOR from '../../../../constants/COLOR';

export const UploadSelect = ({
  value,
  disabled,
  placeholder = '',
  label = '',
  items = [],
  onValueChange = () => {},
}) => {
  return (
    <LabeledSelectComponent>
      <Label style={{ width: 90, textAlign: 'left', paddingRight: 20 }}>{label}</Label>
      <Select
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
        items={items}
        disabled={disabled}
        valueColor={'rgb(115,115,115)'}
      />
    </LabeledSelectComponent>
  );
};

const Label = styled.Text`
  font-size: 17px;
  color: rgb(0, 0, 0);
`;

const LabeledSelectComponent = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 18px;
  border-bottom-width: 1px;
  border-color: ${COLOR.BORDER};
`;

export default UploadSelect;
