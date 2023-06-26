import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { PressableOndemandImage, Spinner } from '../../../atoms/image';
import { Text } from '../../../atoms/text';
import { Row } from '../../../atoms/layout';
import COLOR from '../../../../constants/COLOR';
import getProducts from '../../../net/product/getProducts';

const getCategories = (categories) => {
  let result = [];
  categories.map(({ product_key, initialData }, i) => {
    if (initialData) {
      result = [
        ...result,
        {
          product_key: product_key,
          product_id: initialData.id,
          product_name: initialData.name,
        },
      ];
    }
  });
  return result;
};

const RecommendArea = ({ style, outer, top, bottom, user_id }) => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategory2, setSelectedCategory2] = useState('');

  const initialData = [
    { product_key: 'style', initialData: style },
    { product_key: 'outer', initialData: outer },
    { product_key: 'top', initialData: top },
    { product_key: 'bottom', initialData: bottom },
  ];
  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProductsData = async (categories) => {
    setLoading(true);
    let dataset = [];
    try {
      for (const { product_key, product_id, product_name } of categories) {
        const [data] = await getProducts(product_key, product_id, 1, null, user_id);
        dataset = [
          ...dataset,
          {
            product_name,
            product_key,
            product_id,
            ...data,
            data: data.data.slice?.(0, 10),
          },
        ];
      }
      setProducts(dataset);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let data = getCategories(initialData);
    setCategories(data);
    setSelectedCategory(data[0]?.product_key);
    setSelectedCategory2(data[0]?.product_id);
  }, []);

  useEffect(() => {
    if (categories) {
      getProductsData(categories);
    }
  }, [categories]);

  const handlePressItem = (item) => {
    if (item?.id) {
      navigation.navigate('ProductDetail', {
        screen: 'ProductDetail',
        params: {
          product_id: item.id,
        },
      });
    } else {
      console.error('item.id is not defined');
    }
  };
  const onPressMoreItems = () => {
    if (selectedCategory && selectedCategory2) {
      navigation.navigate('ProductList', {
        screen: 'ProductList',
        params: {
          activeTab: 'search',
          category1: selectedCategory,
          category2: selectedCategory2,
        },
      });
    } else {
      navigation.navigate('ProductList', {
        screen: 'ProductList',
        params: {
          activeTab: 'all',
        },
      });
    }
  };

  return (
    <>
      <View style={{ marginTop: 16 }}>
        <View style={{ borderColor: COLOR.BORDER, borderTopWidth: 1 }}>
          <Row
            centered
            style={{ justifyContent: 'space-between' }}>
            <Text
              size={14}
              style={{
                fontSize: 14,
                color: 'rgba(124,124,124,1)',
                marginVertical: 6,
              }}>
              추천상품
            </Text>
            <ButtonMoreItem onPress={onPressMoreItems}>
              <Text
                size={14}
                style={{ color: 'rgba(124,124,124,1)' }}>
                더보기
              </Text>
            </ButtonMoreItem>
          </Row>
          <Tabs>
            {products?.map(({ data, product_key, product_id, product_name }, index) => (
              <React.Fragment key={`${product_key}`}>
                {product_id && product_name !== '없음' && data?.length > 0 && (
                  <Tab
                    onPress={() => {
                      setSelectedCategory(product_key);
                      setSelectedCategory2(product_id);
                    }}>
                    <Text
                      size={12}
                      style={{
                        fontSize: 12,
                        color: selectedCategory === product_key ? 'rgba(26,26,26,1)' : 'rgba(194,194,194,1)',
                      }}>
                      {product_name}
                    </Text>
                    {selectedCategory === product_key && <SelectedBar />}
                  </Tab>
                )}
              </React.Fragment>
            ))}
          </Tabs>
        </View>
      </View>
      <View style={{ marginTop: 11, marginHorizontal: -16 }}>
        {loading && !products ? <Spinner /> : <></>}
        {!loading &&
          products?.map((v) => {
            if (v.product_key === selectedCategory) {
              return (
                <View
                  key={`${v.product_key}`}
                  style={{
                    marginLeft: 16,
                    marginRight: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {v.data.length > 0 ? (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      onEndReachedThreshold={0.2}
                      keyExtractor={(v, i) => `${i}_${v.id}`}
                      data={v.data}
                      renderItem={({ item }, index) => (
                        <PressableOndemandImage
                          imgSrc={item?.image || item?.thumbnail}
                          width={84}
                          height={84}
                          style={{ marginRight: 3 }}
                          borderRadius={12}
                          handlePressItem={() => handlePressItem(item)}
                        />
                      )}
                      ListFooterComponent={loading && <Spinner />}
                    />
                  ) : (
                    <Text
                      size={12}
                      style={{ color: '#555' }}>
                      추천상품이 없습니다.
                    </Text>
                  )}
                </View>
              );
            } else return null;
          })}
      </View>
    </>
  );
};

const Tabs = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border-color: rgb(220, 220, 220);
  border-bottom-width: 1px;
  width: 100%;
`;

const Tab = styled.Pressable`
  padding: 3px;
  text-align: center;
  margin-right: 20px;
`;
const SelectedBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #000;
`;
const ButtonMoreItem = styled.TouchableOpacity`
  padding: 4px;
`;

export default RecommendArea;
