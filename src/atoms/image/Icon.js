import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

const ImageContainer = styled.Image`
  ${({ size }) => `
    width: ${size}px;
    height: ${size}px;
  `}
`;

const Icon = ({ source, size, resizeMode = 'contain', onPress, onPressIn, style = [], styles = {}, ...props }) => {
  if (onPress) {
    return (
      <TouchableOpacity
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        activeOpacity={0.7}
        onPress={() => {
          onPress?.();
        }}
        {...props}
        style={[...style]}>
        <ImageContainer
          source={source}
          size={size}
          resizeMode={resizeMode}
          style={{ ...styles?.image }}
        />
      </TouchableOpacity>
    );
  } else if (onPressIn) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={() => {
          onPressIn?.();
        }}
        {...props}
        style={[...style]}>
        <ImageContainer
          source={source}
          size={size}
          resizeMode={resizeMode}
          style={{ ...styles?.image }}
        />
      </TouchableOpacity>
    );
  } else {
    return (
      <ImageContainer
        source={source}
        size={size}
        resizeMode={resizeMode}
        {...props}
        style={[...style, { ...styles?.image }]}
      />
    );
  }
};
export default Icon;
