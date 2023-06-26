import React, { useEffect, useRef, useState } from 'react';
import { WhiteSafeArea } from '../../../components/layouts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Spinner } from '../../../atoms/image';
import NoData from '../../../atoms/carousel/NoData';
import getProducts from '../../../net/product/getProducts';
import ProductItemList from '../component/ProductItemList';
import { Spacer } from '../../../atoms/layout';

function AllProductTab(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const [loading, setLoading] = useState(true);

  const postsData = useRef();
  const page = useRef();
  const lastPage = useRef();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    init();
    getPostsData();
    return () => setLoading(false);
  }, []);

  const init = () => {
    setLoading(true);
    postsData.current = [];
    page.current = 1;
    lastPage.current = 1;
  };

  const onEndReached = () => {
    if (loading && !(page.current > lastPage.current)) {
      return;
    } else {
      getPostsData();
    }
  };

  const getPostsData = async () => {
    setLoading(true);
    try {
      const [data] = await getProducts(null, null, page.current, true);
      lastPage.current = data?.lastPage;
      let posts = data?.data;

      if (!(page.current > lastPage.current)) {
        page.current += 1;
        postsData.current = [...postsData.current, ...posts];
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
    navigation.navigate('ProductDetail', {
      screen: 'ProductDetail',
      params: {
        product_id: item.id,
      },
    });
  }

  return (
    <WhiteSafeArea>
      <Spacer size={10} />
      {(!postsData.current || postsData.current?.length === 0) && loading && <Spinner />}
      {postsData.current?.length > 0 ? (
        <ProductItemList
          handlePressItem={handlePressItem}
          dataset={postsData.current}
          onEndReached={onEndReached}
          ListFooterComponent={page.current <= lastPage.current && <Spinner />}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
        />
      ) : (
        <>{!loading && <NoData text={'등록된 상품이 없습니다.'} />}</>
      )}
    </WhiteSafeArea>
  );
}

export default AllProductTab;
