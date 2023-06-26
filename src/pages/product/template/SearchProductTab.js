import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { withContext } from 'context-q';
import { Icon, Spinner } from '../../../atoms/image';
import WhiteSafeArea from '../../../components/layouts/WhiteSafeArea';
import NoData from '../../../atoms/carousel/NoData';
import { Button } from '../../../atoms/button';
import { Spacer } from '../../../atoms/layout';
import getProducts from '../../../net/product/getProducts';
import ProductItemList from '../component/ProductItemList';
import styled from 'styled-components';
import { Text } from '../../../atoms/text';
import _ from 'lodash';

const CategoryHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 10px 4px 5px;
  background-color: #fff;
`;
const SearchButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 30px;
  background-color: #eee;
  border-radius: 8px;
`;

function SearchProductTab(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const { searchFilter, setVisibleModal, styleList } = props;

  const postsData = useRef();
  const page = useRef();
  const lastPage = useRef();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  //
  // const selectedCategory1Text = useMemo(() => {
  //   switch (searchFilter?.category1) {
  //     case 'top':
  //       return ' 상의';
  //     case 'bottom':
  //       return ' 하의';
  //     case 'style':
  //       return ' 스타일';
  //     case 'outer':
  //       return ' 아우터';
  //     default:
  //       return null;
  //   }
  // }, [searchFilter]);

  const selectedCategory2Text = useMemo(() => {
    let result = '';
    if (props.searchFilter?.category1) {
      let c2 = styleList[props.searchFilter.category1];
      if (c2) {
        let obj = _.find(c2, { value: props.searchFilter.category2 });
        if (obj) {
          result = obj.label;
        }
      }
    }
    return result;
  }, [styleList, props.searchFilter]);

  useEffect(() => {
    init();
    if (searchFilter?.category2) {
      getPostsData();
    } else {
      setLoading(false);
    }
    return () => init();
  }, [route?.params, searchFilter]);

  const init = () => {
    setLoading(true);
    page.current = 1;
    lastPage.current = 1;
    postsData.current = [];
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
      const [data] = await getProducts(
        searchFilter?.category1 || null,
        searchFilter?.category2 || null,
        page.current,
        true,
      );
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

  const handlePressItem = (item) => {
    navigation.navigate('ProductDetail', {
      screen: 'ProductDetail',
      params: {
        product_id: item.id,
      },
    });
  };

  return (
    <WhiteSafeArea>
      {postsData.current?.length > 0 ? (
        <ProductItemList
          dataset={postsData.current}
          refreshing={refreshing}
          onEndReached={onEndReached}
          handlePressItem={handlePressItem}
          handleRefresh={handleRefresh}
          ListHeaderComponent={() => (
            <CategoryHeader>
              <Text size={14}>
                <Text
                  style={{ color: '#999' }}
                  size={14}>
                  선택된 카테고리:
                </Text>
                {` ${selectedCategory2Text}`}
              </Text>
              <SearchButton
                onPress={() => {
                  setVisibleModal(true);
                }}>
                <Text size={14}>재검색</Text>
                <Spacer size={4} />
                <Icon
                  source={require('../../../../assets/search.png')}
                  size={14}
                />
              </SearchButton>
            </CategoryHeader>
          )}
          ListFooterComponent={page.current <= lastPage.current && <Spinner />}
        />
      ) : (
        <>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <NoData text={'검색된 상품이 없습니다.'}>
                <Spacer size={20} />
                <Button
                  fontSize={14}
                  onPress={() => {
                    setVisibleModal(true);
                  }}>
                  검색
                </Button>
              </NoData>
            </>
          )}
        </>
      )}
    </WhiteSafeArea>
  );
}

SearchProductTab = withContext(SearchProductTab);
export default SearchProductTab;
