import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import { withContext } from 'context-q';

import { GraySpace, Spacer } from '../../atoms/layout';
import GridLayout from '../../atoms/layout/GridLayout';
import { Spinner } from '../../atoms/image';
import { Text } from '../../atoms/text';
import WhiteSafeArea from '../../components/layouts/WhiteSafeArea';
import { NavHead } from '../../components/layouts';
import { usePersistentState } from '../../hooks';
import getMyInfo from '../../net/user/getMyInfo';
import getMyPosts from '../../net/user/getMyPosts';
import Profile from './component/Profile';
import tw from 'twrnc';
import COLOR from '../../../constants/COLOR';
import { useFetch } from '../../net/core/useFetch';
import { API_HOST } from '@env';
import SwrContainer from '../../components/layouts/SwrContainer';
import { MerchandiseItem } from '../../components';

const NoDataArea = styled.View`
  align-items: center;
  height: 100%;
  padding-top: 100px;
  background-color: #eff0f2;
`;

function MyPageTab({ activeTab, setActiveTab }) {
  return (
    <View style={{ flexDirection: 'row', height: 45 }}>
      <Pressable
        style={[{ height: '100%', width: '50%', justifyContent: 'center', alignItems: 'center' }]}
        onPress={() => {
          setActiveTab('daily');
        }}>
        <View
          style={[
            {
              height: '100%',
              justifyContent: 'center',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'daily' ? COLOR.PRIMARY : 'transparent',
            },
          ]}>
          <Text style={tw`text-black font-bold`}>데일리룩</Text>
        </View>
      </Pressable>
      <Pressable
        style={[{ height: '100%', width: '50%', justifyContent: 'center', alignItems: 'center' }]}
        onPress={() => {
          setActiveTab('merchandises');
        }}>
        <View
          style={[
            {
              height: '100%',
              justifyContent: 'center',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'merchandises' ? COLOR.PRIMARY : 'transparent',
            },
          ]}>
          <Text style={tw`text-black font-bold`}>판매 아이템</Text>
        </View>
      </Pressable>
    </View>
  );
}

function MyPage(props) {
  const navigation = useNavigation();
  const [myData, setMyData] = useState({});
  const [activeTab, setActiveTab] = useState('daily');
  const [mypageValue, setMypageValue] = usePersistentState('posts_mypage');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { data, error, mutate } = useFetch(`${API_HOST}/v1/users/${props.context.user.id}/merchandises`);
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const GAP = 12;
  const ITEMS_PER_ROW = 3;
  const ITEM_WIDTH = (WINDOW_WIDTH - GAP * (ITEMS_PER_ROW + 1)) / ITEMS_PER_ROW;
  useFocusEffect(
    useCallback(() => {
      fetchMyInfo();
      getData(true);
      mutate();
    }, []),
  );

  useEffect(() => {
    setMyData(null);
    fetchMyInfo();
    getData(true);

    return () => {
      getData(true);
      setLoading(false);
    };
  }, [props.context.user]);

  const getData = async (init = false) => {
    setLoading(true);
    try {
      const [response] = await getMyPosts(init ? 1 : mypageValue.page);
      let newData = response?.data;
      if (!init) {
        let newValue = {
          ...mypageValue,
          lastPage: response?.lastPage,
        };

        if (!(mypageValue.page > mypageValue.lastPage)) {
          newValue = {
            ...mypageValue,
            page: mypageValue.page + 1,
            data: [...mypageValue.data, ...newData],
          };
        }
        setMypageValue(newValue);
      } else {
        let newValue = {
          ...mypageValue,
          data: newData,
          page: 2,
          lastPage: response?.lastPage,
        };
        setMypageValue(newValue);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMyInfo = async () => {
    try {
      const [data] = await getMyInfo();
      setMyData(data);
    } catch (error) {
      console.warn(error);
    }
  };

  const onEndReached = () => {
    if (loading && !(mypageValue.page > mypageValue.lastPage)) {
      return;
    } else {
      getData();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setMyData(null);
    try {
      await getData(true);
      await fetchMyInfo();
    } catch (error) {
      console.warn(error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handlePressItem = (item) => {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        from: 'myPage',
      },
    });
  };

  const onBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  if (mypageValue.data?.length === 0 && !loading) {
    return (
      <WhiteSafeArea style={{ flex: 1 }}>
        <NavHead />
        <Profile
          isCommerceOn={props.context?.commerce}
          myData={myData}
        />
        <MyPageTab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <GraySpace />
        <NoDataArea>
          <Image
            style={{ width: 61, height: 61 }}
            source={require('../../../assets/mypage_empty.png')}
          />
          <Spacer size={20} />
          <Text
            bold
            align='center'
            size={16}>
            스타일을 공유하고 유저들과 패션으로 {'\n'}연결되어 보세요!
          </Text>
          <Spacer size={20} />
        </NoDataArea>
      </WhiteSafeArea>
    );
  }

  return (
    <WhiteSafeArea>
      <NavHead />
      {(!mypageValue.data || mypageValue.data?.length === 0) && loading && <Spinner />}
      {activeTab === 'daily' && mypageValue.data?.length > 0 && (
        <>
          <GridLayout
            useFlatlist
            handlePressItem={handlePressItem}
            dataset={mypageValue.data}
            onEndReached={onEndReached}
            ListFooterComponent={mypageValue.page <= mypageValue.lastPage && <Spinner />}
            refreshing={refreshing}
            handleRefresh={handleRefresh}
            ListHeaderComponent={
              <>
                <Profile
                  isCommerceOn={props.context?.commerce}
                  myData={myData}
                />
                <MyPageTab
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

                <GraySpace />
              </>
            }
          />
        </>
      )}
      {activeTab === 'merchandises' && (
        <ScrollView style={{ flex: 1 }}>
          <Profile
            isCommerceOn={props.context?.commerce}
            myData={myData}
          />
          <MyPageTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <GraySpace />
          <SwrContainer
            data={data}
            error={error}>
            <View style={tw`flex-row flex-wrap`}>
              {data && data.data.length > 0 ? (
                data.data.map((merchandise) => (
                  <View
                    key={merchandise.id.toString()}
                    style={{ marginLeft: GAP }}>
                    <MerchandiseItem
                      merchandise={merchandise}
                      width={ITEM_WIDTH}
                    />
                  </View>
                ))
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Text style={{ fontSize: 20, color: '#e4e4e4', fontWeight: '700' }}>판매중인 상품이 없어요</Text>
                </View>
              )}
            </View>
          </SwrContainer>
        </ScrollView>
      )}
    </WhiteSafeArea>
  );
}

export default withContext(MyPage);
