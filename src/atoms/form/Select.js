import React from 'react';
import styled from 'styled-components/native';
import { Image, Platform } from 'react-native';
import Picker from 'react-native-picker-select';

const Component = styled.View`
  flex: 1;
  justify-content: center;
  height: 27px;
`;

function Select({
  label,
  value,
  valueColor = '#000',
  onValueChange = (value) => {},
  placeholder = '',
  items = [],
  styles = {},
}) {
  return (
    <Component style={styles?.container ? { ...styles?.container } : {}}>
      <Picker
        Icon={() =>
          Platform.OS === 'ios' ? (
            <Image
              source={require('../../../assets/arrow_down.png')}
              style={{ width: 18, height: 10 }}
            />
          ) : null
        }
        items={items}
        label={label}
        placeholder={placeholder}
        placeholderTextColor='#818181'
        style={{
          iconContainer: { top: 8, right: 10 },
          inputAndroid: {
            background: '#fff',
            width: '100%',
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 15,
            color: valueColor,
          },
          inputIOS: {
            backgroundColor: '#fff',
            height: 27,
            width: '100%',
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 15,
            color: valueColor,
          },
        }}
        useNativeAndroidPickerStyle={true}
        value={value}
        onValueChange={onValueChange}
      />
    </Component>
  );
}

export default Select;
