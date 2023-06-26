import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Icon from '../../../atoms/image/Icon';
import { Spacer } from '../../../atoms/layout';
import { useNavigation } from '@react-navigation/native';
import { CategoryModal } from '../SearchResultPage';
import tw from 'twrnc';

const SearchHeader = ({ back = false, searchText, setSearchText }) => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View
      style={{
        height: 65,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}>
      {back && (
        <Pressable
          onPress={() => {
            navigation.navigate('Ootd', {
              activeTab: 'daily',
              from: 'home',
            });
          }}
          style={{ marginRight: 13 }}>
          <Icon
            source={require('../../../../assets/back_ic.png')}
            size={20}></Icon>
        </Pressable>
      )}
      <View
        style={{
          backgroundColor: 'rgba(242,242,242,1)',
          flex: 1,
          height: 35,
          borderRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
        }}>
        {!back && (
          <>
            <Icon
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              source={require('../../../../assets/search.png')}
              size={15}
            />
            <Spacer width={10} />
          </>
        )}
        <TextInput
          style={[tw`text-black p-0 flex-1`, { fontSize: 17 }]}
          placeholder={'페어링 통합검색'}
          value={searchText}
          placeholderTextColor={'rgba(180,180,180,1)'}
          onChangeText={(text) => setSearchText(text)}
          onSubmitEditing={() => {
            if (!back) {
              navigation.navigate('SearchResultPage', {
                searchText: searchText,
              });
            }
          }}></TextInput>
      </View>
      <Spacer width={20}></Spacer>
      <Pressable onPress={() => setIsVisible(true)}>
        <Icon
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
          source={require('../../../../assets/search.png')}
          size={23}
        />
      </Pressable>

      <Spacer width={10}></Spacer>
      <Icon
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        source={require('../../../../assets/notification_ic.png')}
        size={23}
      />
      <CategoryModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </View>
  );
};

export default SearchHeader;
