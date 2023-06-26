import React, { useCallback, useState } from 'react';
import WhiteSafeArea from '../../../components/layouts/WhiteSafeArea';
import SearchHeader from './SearchHeader';
import { useFocusEffect } from '@react-navigation/native';

function OotdLayout({ children, route, ...props }) {
  const [searchText, setSearchText] = useState('');
  useFocusEffect(
    useCallback(() => {
      setSearchText('');
    }, []),
  );
  return (
    <WhiteSafeArea>
      <SearchHeader
        searchText={searchText}
        setSearchText={setSearchText}></SearchHeader>
      {children}
    </WhiteSafeArea>
  );
}

export default OotdLayout;
