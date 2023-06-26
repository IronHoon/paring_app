import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../atoms/text';
import styled from 'styled-components/native/dist/styled-components.native.esm';

const SelectView = styled.View`
  width: 103px;
  height: 31px;
  border-radius: 8px;
  border-color: rgba(49, 49, 49, 1);
  border-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const SpaceBetweenDescription = (props) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Text
        size={14}
        style={{ color: 'rgb(124,124,124)', marginRight: 18, width: 50 }}>
        {props.label}
      </Text>
      <SelectView style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {props.children}
      </SelectView>
    </View>
  );
};

export default SpaceBetweenDescription;
