import React, { useCallback, useState } from 'react';
import { NavHead, WhiteSafeArea } from '../../../components/layouts';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import GridLayout from '../../../atoms/layout/GridLayout';
import { Spinner } from '../../../atoms/image';
import NoData from '../../../atoms/carousel/NoData';
import getMyBookmarks from '../../../net/bookmark/getMyBookmarks';
import { Dimensions, Pressable, ScrollView, View } from 'react-native';
import COLOR from '../../../../constants/COLOR';
import { Text } from '../../../atoms/text';
import tw from 'twrnc';
import SwrContainer from '../../../components/layouts/SwrContainer';
import { MerchandiseItem } from '../../../components';
import { useFetch } from '../../../net/core/useFetch';
import { API_HOST } from '@env';

function BookmarkPage(props) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const [postsData, setPostsData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');

  // const { data, error, mutate } = useFetch(`${API_HOST}/v1/users/${4432}/merchandises`);
  const { data, error, mutate } = useFetch(`${API_HOST}/v1/wish-items`);

  // const {data:bookmarkData} = useFetch(`${API_HOST}/v1/wish-items`);
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const GAP = 12;
  const ITEMS_PER_ROW = 3;
  const ITEM_WIDTH = (WINDOW_WIDTH - GAP * (ITEMS_PER_ROW + 1)) / ITEMS_PER_ROW;

  useFocusEffect(
    useCallback(() => {
      init();
      getPostsData();
      return () => setLoading(false);
    }, []),
  );

  const init = () => {
    setLoading(true);
    setPostsData([]);
    setPage(1);
    setLastPage(1);
  };

  const onEndReached = () => {
    if (loading && !(page > lastPage)) {
    } else {
      getPostsData();
    }
  };
  const getPostsData = async () => {
    setLoading(true);
    try {
      const [data] = await getMyBookmarks(page);
      setLastPage(data?.lastPage);
      let posts = data?.data;
      posts = posts?.map?.((v) => v.post) || [];

      if (lastPage === 1) {
        setPostsData(posts);
      } else {
        if (!(page > lastPage)) {
          setPage(page + 1);
          setPostsData([...posts, ...postsData]);
        }
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    init();
    getPostsData();
  };

  function handlePressItem(item) {
    navigation.navigate('StyleFeed', {
      screen: 'StyleFeed',
      params: {
        feed: item,
        feedId: item?.id,
        from: 'bookmark',
      },
    });
  }

  return (
    <WhiteSafeArea>
      <NavHead title={'북마크'} />
      <View style={{ flexDirection: 'row', height: 45, borderBottomWidth: 2, borderBottomColor: '#e4e4e4' }}>
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
              },
            ]}>
            <Text style={tw`text-black font-bold`}>데일리룩</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'daily' ? COLOR.PRIMARY : 'transparent',
              height: '100%',
              bottom: -1,
              width: 80,
            }}></View>
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
              },
            ]}>
            <Text style={tw`text-black font-bold`}>상품</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'merchandises' ? COLOR.PRIMARY : 'transparent',
              height: '100%',
              bottom: -1,
              width: 80,
            }}></View>
        </Pressable>
      </View>
      {loading && postsData?.length <= 0 && <Spinner />}
      {activeTab === 'daily' && postsData?.length > 0 ? (
        <GridLayout
          handlePressItem={handlePressItem}
          from={'bookmark'}
          dataset={postsData}
          onEndReached={onEndReached}
          ListFooterComponent={loading && <Spinner />}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
        />
      ) : (
        <>{!loading && activeTab === 'daily' && <NoData />}</>
      )}
      {activeTab === 'merchandises' && (
        <ScrollView style={{ flex: 1 }}>
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
                      merchandise={merchandise.merchandise}
                      width={ITEM_WIDTH}
                    />
                  </View>
                ))
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Text style={{ fontSize: 20, color: '#e4e4e4', fontWeight: '700' }}>북마크한 상품이 없어요</Text>
                </View>
              )}
            </View>
          </SwrContainer>
        </ScrollView>
      )}
    </WhiteSafeArea>
  );
}

export default BookmarkPage;
