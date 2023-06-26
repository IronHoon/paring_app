import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../atoms/text';
import styled from 'styled-components/native/dist/styled-components.native.esm';

const SelectView = styled.View``;

const SpaceBetweenDescription = (props) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Text
        size={14}
        style={{ color: 'rgb(124,124,124)', marginRight: 18, width: 50, textAlign: 'center' }}>
        {props.label}
      </Text>
      <SelectView style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
        {props.children}
      </SelectView>
    </View>
  );
};

export default SpaceBetweenDescription;
