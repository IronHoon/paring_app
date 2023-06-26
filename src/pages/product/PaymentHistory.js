import React, { useCallback, useRef, useState } from 'react';
import { BackHandler, FlatList, View } from 'react-native';

import WhiteSafeArea from '../../components/layouts/WhiteSafeArea';
import { NavHead } from '../../components/layouts';

import BuyingHistoryItem from './component/BuyingHistoryItem';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import getOrders from '../../net/order/getOrders';
import NoData from '../../atoms/carousel/NoData';
import { Spinner } from '../../atoms/image';

function PaymentHistoryPage(props) {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const page = useRef();
  const lastPage = useRef();

  useFocusEffect(
    useCallback(() => {
      init();
      getHistoryData();
    }, [props.route]),
  );

  const init = () => {
    setLoading(true);
    setRefreshing(false);
    setOrderHistory([]);
    page.current = 1;
    lastPage.current = 1;
  };

  const getHistoryData = async () => {
    setLoading(true);
    try {
      const [data] = await getOrders(page.current);
      let _d = data?.data || [];

      if (page.current === 1) {
        setOrderHistory([..._d]);
        page.current += 1;
      } else {
        if (!(page.current > data?.lastPage)) {
          page.current += 1;
          setOrderHistory([...orderHistory, ..._d]);
        }
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onEndReached = () => {
    if (loading && !(page.current > lastPage.current)) {
      return;
    } else {
      getHistoryData();
    }
  };

  const onEndReachedCalledDuringMomentum = useRef();

  const handleRefresh = () => {
    setRefreshing(true);
    init();
    getHistoryData();
  };

  const navigation = useNavigation();
  const onBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Mypage');
    }
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <WhiteSafeArea>
      <NavHead title={'구매내역'} />
      <View style={{ flex: 1 }}>
        {orderHistory?.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onEndReachedThreshold={0.2}
            keyExtractor={(v, i) => `${v.id}`}
            data={orderHistory}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            renderItem={BuyingHistoryItem}
            ListFooterComponent={page.current <= lastPage.current && <Spinner />}
            disableVirtualization={false}
            removeClippedSubviews={true} // bug exist
            legacyImplementation={true}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            onEndReached={(e) => {
              if (!onEndReachedCalledDuringMomentum.current) {
                onEndReached(e); // LOAD MORE DATA
                onEndReachedCalledDuringMomentum.current = true;
              }
            }}
          />
        ) : (
          <>
            {loading ? (
              <Spinner />
            ) : (
              <View>
                <NoData text={'구매내역이 없습니다'} />
              </View>
            )}
          </>
        )}
      </View>
    </WhiteSafeArea>
  );
}

export default PaymentHistoryPage;
