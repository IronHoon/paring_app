import React from 'react';
import styled from 'styled-components';
import { Pressable, View } from 'react-native';
import { Text } from '../text';

const NumberSpinner = ({ value, setValue, style = {} }) => {
  return (
    <CounterWrapper style={style}>
      <Pressable
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        onPress={() => {
          if (value > 1) {
            setValue(value - 1);
          }
        }}>
        <Text style={{ color: 'rgb(124,124,124)', fontWeight: 'bold', fontSize: 20 }}>-</Text>
      </Pressable>
      <View style={{ width: 50, alignItems: 'center' }}>
        <Text>{value}</Text>
      </View>
      <Pressable
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        onPress={() => {
          if (value < 100) {
            setValue(value + 1);
          }
        }}>
        <Text style={{ color: 'rgb(124,124,124)', fontWeight: 'bold' }}>+</Text>
      </Pressable>
    </CounterWrapper>
  );
};

const CounterWrapper = styled.View`
  width: 90px;
  height: 31px;
  border-radius: 10px;
  border-color: rgba(124, 124, 124, 1);
  border-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
export default NumberSpinner;
