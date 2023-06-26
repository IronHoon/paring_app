import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { useFocusEffect } from '@react-navigation/native';
import { Tab } from './Tab';
import { View } from 'react-native';

const Container = styled(View)`
  flex-display: row;
`;

export const TabMenu = ({ isSearching, setIsSearching, menu, initialValue = '', onPress, onListRefresh, theme }) => {
  const [selected, setSelected] = useState(initialValue);
  useFocusEffect(
    useCallback(() => {
      if (setIsSearching) {
        setIsSearching(false);
      }
    }, []),
  );

  //@ts-ignore
  const handleChange = (value) => {
    setSelected(value);
    if (onListRefresh) {
      onListRefresh();
    }
    onPress(value);
  };

  return (
    <Container
      fullWidth
      style={{ flexDirection: 'row' }}>
      {menu.map(({ label, value, iconSelect, iconNoSelect }) => (
        <Tab
          key={value}
          label={label}
          iconSelect={iconSelect}
          iconNoSelect={iconNoSelect}
          length={menu.length}
          selected={selected}
          value={value}
          onChange={handleChange}
          theme={theme}
        />
      ))}
    </Container>
  );
};
