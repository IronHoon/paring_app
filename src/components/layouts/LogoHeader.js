import React, { useState } from 'react';
import { Image, Pressable, TextInput, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { withContext } from 'context-q';

import { Row, Spacer } from '../../atoms/layout';
import { Icon } from '../../atoms/image';
import tw from 'twrnc';

const Wrapper = styled.SafeAreaView`
  z-index: 10;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-color: rgba(220, 220, 220, 0.5);
`;

const LogoWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`;

const Buttons = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LogoHeader = (props) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  const onPressShopping = () => {
    navigation.navigate('MyPage', {
      screen: 'MyPage',
      params: {
        activeTab: 'all',
      },
    });
  };

  return (
    <Wrapper>
      <LogoWrapper style={{ paddingRight: props.search ? 0 : 20 }}>
        {props.isBack ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Ootd', {
                screen: 'Ootd',
                params: {
                  activeTab: 'daily',
                  from: 'home',
                },
              });
            }}>
            <Icon
              source={require('../../../assets/back_new.png')}
              size={20}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.4}
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <Row style={{ alignItems: 'center' }}>
              <Image
                style={{ width: 59, height: 26 }}
                resizeMode={'contain'}
                source={require('../../../assets/logo_pairing.png')}
                alt={'Pairing'}
              />
            </Row>
          </TouchableOpacity>
        )}
        {props.search ? (
          <View
            style={{
              height: 65,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                backgroundColor: 'rgba(242,242,242,1)',
                height: 35,
                flex: 1,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 15,
              }}>
              <>
                <Icon
                  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                  source={require('../../../assets/search.png')}
                  size={15}
                />
                <Spacer width={10} />
              </>
              <TextInput
                style={[tw`text-black p-0 flex-1`, { fontSize: 17 }]}
                placeholder={'페어링 통합검색'}
                value={searchText}
                placeholderTextColor={'rgba(180,180,180,1)'}
                onChangeText={(text) => setSearchText(text)}
                onSubmitEditing={() => {
                  navigation.navigate('SearchResultPage', {
                    searchText: searchText,
                  });
                }}></TextInput>
            </View>
            <Spacer width={15} />
            <Pressable
              onPress={() =>
                navigation.navigate('Ootd', {
                  screen: 'Ootd',
                  params: {
                    activeTab: 'daily',
                    from: 'nav',
                  },
                })
              }>
              <Icon
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                source={require('../../../assets/search.png')}
                size={23}
              />
            </Pressable>

            <Spacer width={10}></Spacer>
            <Icon
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              source={require('../../../assets/notification_ic.png')}
              size={23}
            />
          </View>
        ) : (
          <Buttons>
            {!props.isBack && (
              <Icon
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                source={require('../../../assets/search.png')}
                size={21}
                onPress={() => {
                  // navigation.navigate('SearchMainPage')
                  if (props.route?.name === 'Ootd') {
                    navigation.navigate('Ootd', {
                      activeTab: 'search',
                      from: 'nav',
                    });
                  } else {
                    navigation.navigate('Ootd', {
                      screen: 'Ootd',
                      params: {
                        activeTab: 'search',
                        from: 'nav',
                      },
                    });
                  }
                }}
              />
            )}
            {props.context?.commerce && (
              <>
                <Spacer width={18} />
                <Icon
                  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                  source={require('../../../assets/cart.png')}
                  size={22}
                  onPress={() => {
                    navigation.navigate('Cart', {
                      screen: 'Cart',
                    });
                  }}
                />
              </>
            )}
            {/*<Spacer width={18} />*/}
            {/*<Button buttonHeight={'34px'} onPress={onPressShopping}>*/}
            {/*  쇼핑*/}
            {/*</Button>*/}
          </Buttons>
        )}
      </LogoWrapper>
    </Wrapper>
  );
};

export default withContext(LogoHeader);
