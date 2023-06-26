import React from 'react';
import styled from 'styled-components';

import COLOR from '../../../constants/COLOR';
import { Text } from '../text';

function Checkbox({ disabled, checked, setChecked, ...props }) {
  return (
    <Component
      disabled={disabled}
      checked={checked}
      onPress={() => {
        setChecked(!checked);
      }}>
      {checked && !disabled && (
        <Text
          size={14}
          style={{ color: '#fff' }}>
          V
        </Text>
      )}
    </Component>
  );
}

const Component = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  border: 1px solid #000;
  color: ${COLOR.BORDER};
  ${({ checked }) => (checked ? `backgroundColor:${COLOR.PRIMARY};` : ``)}
  ${({ disabled }) => (disabled ? 'borderColor:#999;backgroundColor:#ddd;' : '')}
`;

export default Checkbox;
