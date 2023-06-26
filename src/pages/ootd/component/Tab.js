import React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import styled from 'styled-components';
import COLOR from '../../../../constants/COLOR';

const { width: WIDTH } = Dimensions.get('window');

const TabButton = styled(Pressable)`
  align-items: center;
  border-bottom-style: solid;
  display: flex;
  height: 35px;
  justify-content: center;
  width: ${({ length }) => (length ? `${WIDTH / length}px;` : '100%')};

  ${({ active }) =>
    active
      ? `border-bottom-color: ${COLOR.PRIMARY}; border-bottom-width: 2px; color: ${COLOR.PRIMARY};`
      : `border-bottom-color: rgba(243,243,243,1); border-bottom-width: 1px; color: yellow;`}
`;
const ButtonText = styled(Text)`
  font-size: 16px;
  color: black;
  font-weight: 900;
`;

export const Tab = ({ label, iconSelect, iconNoSelect, length, selected, value, onChange, theme }) => (
  <TabButton
    active={false}
    length={length}
    onPress={() => onChange(value)}
    theme={theme}>
    {label && <ButtonText active={value === selected}>{label}</ButtonText>}
    {value === selected ? iconSelect : iconNoSelect}
    <View
      style={{
        position: 'absolute',
        bottom: -1,
        height: 2,
        width: '50%',
        backgroundColor: value === selected ? COLOR.PRIMARY : 'transparent',
      }}
    />
  </TabButton>
);
