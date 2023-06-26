import React, { useCallback, useState } from 'react';
import styled from 'styled-components/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert, ScrollView, View } from 'react-native';
import { withContext } from 'context-q';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CART_KEY } from '@env';

import COLOR from '../../../constants/COLOR';
import { NavHead, WhiteSafeArea } from '../../components/layouts';
import { deviceWidth, Row, Spacer } from '../../atoms/layout';
import { Text } from '../../atoms/text';
import { Button } from '../../atoms/button';
import SpaceBetweenDescription from './atoms/SpaceBetweenDescription';
import { Spinner } from '../../atoms/image';
import NoData from '../../atoms/carousel/NoData';
import getProductOptions from '../../net/product/getProductOptions';
import PressableOndemandImage from '../../atoms/image/PressableOndemandImage';
import getProduct from '../../net/product/getProduct';
import { NumberSpinner } from '../../atoms/form';
import AutoHeightWebView from 'react-native-autoheight-webview';

const checkValid = (count, color, size) => {
  let valid = false;
  if (!color) Alert.alert('', '색상을 선택해주세요.');
  else if (!size) Alert.alert('', '사이즈를 선택해주세요.');
  else valid = true;
  return valid;
};
const getNewCartData = (cartData = [], newItem) => {
  let newCartData = [...cartData];
  newCartData = newCartData.map((x) => {
    if (x.size_id === newItem.size_id && x.color_id === newItem.color_id) return newItem;
    else return x;
  });
  return newCartData;
};

function ProductDetailPage(props) {
  const navigation = useNavigation();
  const params = props.route?.params;

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({});
  const [optionsData, setOptionsData] = useState(null);
  const initialOption = {
    id: null,
    count: 1,
    color_id: null,
    size_id: null,
    product_data: {},
  };
  const [selectedOptions, setSelectedOptions] = useState(initialOption);
  const [cartData, setCartData] = useState(props?.context?.cartData || []);

  const [descImageSize, setDescImageSize] = useState({ width: deviceWidth, height: deviceWidth });

  const init = () => {
    setProductData(null);
    setOptionsData(null);
    setLoading(true);
    setSelectedOptions(initialOption);
  };

  useFocusEffect(
    useCallback(() => {
      let _id = props.route?.params?.product_id;
      if (_id) {
        fetchProductData(_id);
        fetchOptionData(_id);
      }
      return () => {
        init();
      };
    }, [props.route?.params]),
  );

  useFocusEffect(
    useCallback(() => {
      setCartData(props.context?.cartData || []);
    }, [props.context?.cartData]),
  );

  const updateCartContext = (_cartData) => {
    const orderedCartData = _.orderBy(_cartData, 'id', 'desc');
    props.context.update({
      ...props.context,
      cartData: orderedCartData,
    });

    AsyncStorage.setItem(CART_KEY, JSON.stringify(orderedCartData));
  };

  const fetchProductData = async (product_id) => {
    setLoading(true);
    try {
      const [data] = await getProduct(product_id);
      setProductData(data);
      await fetchOptionData(product_id);
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  const fetchOptionData = async (product_id) => {
    try {
      const [data] = await getProductOptions(product_id);
      setOptionsData(data);
    } catch (error) {
      throw error;
    }
  };
  const addToCart = async () => {
    try {
      const { id, count, color_id, size_id, product_data } = selectedOptions;
      if (!checkValid(count, color_id, size_id)) return false;

      const sameItem = _.filter(cartData, (x) => x.size_id === size_id && x.color_id === color_id)?.[0] || [];
      const hasSameItem = !!sameItem?.id;

      if (hasSameItem) {
        Alert.alert('', `장바구니에 같은 상품이 있습니다. \n수량을 추가하시겠습니까?`, [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '추가',
            onPress: () => {
              let sumData = { ...sameItem };
              sumData.count += count;

              const newCartData = getNewCartData(cartData, sumData);
              updateCartContext(newCartData);
              showAddToCartAlert();
            },
          },
        ]);
      } else {
        const newCartData = [...cartData, selectedOptions];
        updateCartContext(newCartData);
        showAddToCartAlert();
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const addCartItem = (newCartData) => {
    updateCartContext(newCartData);
    showAddToCartAlert();
  };

  const showAddToCartAlert = () => {
    Alert.alert('', `장바구니에 상품이 추가되었습니다. \n장바구니로 이동하시겠습니까?`, [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '이동',
        onPress: () => {
          navigation.navigate('Cart', {
            screen: 'Cart',
          });
        },
      },
    ]);
  };

  const onPressColor = ({ id, product_id, name }) => {
    if (id !== selectedOptions.color_id) {
      setSelectedOptions({
        ...initialOption,
        id: product_id,
        color_id: id,
        product_data: {
          product_name: productData.name,
          color_name: name,
          thumbnail: productData.thumbnail,
        },
        unit_amount: productData.price,
        origin_delivery_fee: productData.delivery_fee,
      });
    }
  };

  const onPressSize = ({ id, name, thumbnail }) => {
    if (selectedOptions.color_id) {
      if (id !== selectedOptions.size_id) {
        const _d = {
          ...selectedOptions,
          size_id: id,
          product_data: {
            ...selectedOptions.product_data,
            size_name: name,
          },
        };
        setSelectedOptions(_d);
      }
    } else {
      Alert.alert('', '색상을 선택해주세요.');
    }
  };

  const buyNow = async () => {
    try {
      if (!checkValid(selectedOptions.count, selectedOptions.color_id, selectedOptions.size_id)) return false;
      navigation.navigate('Payment', {
        screen: 'Payment',
        params: {
          data: {
            amounts: selectedOptions.unit_amount * selectedOptions.count,
            delivery_fee: selectedOptions.origin_delivery_fee,
            origin_delivery_fee: selectedOptions.origin_delivery_fee,
            products: [
              {
                ...selectedOptions,
                delivery_fee: selectedOptions.origin_delivery_fee,
              },
            ],
            totalAmounts: selectedOptions.unit_amount * selectedOptions.count + selectedOptions.origin_delivery_fee,
          },
        },
      });
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <WhiteSafeArea>
      <NavHead title={!loading && (productData?.name || '상품명 없음')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {productData ? (
              <>
                <View>
                  <PressableOndemandImage
                    width={deviceWidth}
                    height={deviceWidth * 1.187}
                    defaultImg={require('../../../assets/iconLogoBlack.png')}
                    imgSrc={productData?.thumbnail}
                  />
                </View>
                <Spacer height={22} />
                <View style={{ paddingLeft: 16, paddingRight: 16 }}>
                  <Text size={17}>{productData?.name || '상품명 없음'}</Text>
                  <Spacer height={21} />
                  <Text size={21}>
                    {productData?.price ? new Intl.NumberFormat().format(productData.price) : '-'}원
                  </Text>
                  <Spacer height={19} />
                  <View
                    style={{
                      borderColor: COLOR.BORDER,
                      borderTopWidth: 1,
                      paddingTop: 18,
                    }}>
                    <Row centered>
                      <Text size={14}>배송금액</Text>
                      <Text
                        size={14}
                        style={{ color: 'rgb(124,124,124)', marginLeft: 15 }}>
                        {productData?.delivery_fee ? new Intl.NumberFormat().format(productData.delivery_fee) : '-'}원
                      </Text>
                    </Row>
                    <Spacer height={20} />

                    <SpaceBetweenDescription label={'수량'}>
                      <NumberSpinner
                        style={{ marginBottom: 8 }}
                        value={selectedOptions.count}
                        setValue={(v) => {
                          setSelectedOptions({ ...selectedOptions, count: v });
                        }}
                      />
                    </SpaceBetweenDescription>
                    <Spacer height={15} />

                    <SpaceBetweenDescription label={'색상'}>
                      {optionsData?.map((v, i) => (
                        <OptionItem
                          data={v}
                          isSelected={v.id === selectedOptions.color_id}
                          key={`${v.id}`}
                          onPress={() => {
                            onPressColor(v);
                          }}
                        />
                      ))}
                    </SpaceBetweenDescription>
                    <Spacer height={15} />

                    <SpaceBetweenDescription label={'사이즈'}>
                      {optionsData?.[0]?.options?.map((v, i) => (
                        <OptionItem
                          data={v}
                          isSelected={v.id === selectedOptions.size_id}
                          key={`${v.id}`}
                          onPress={() => {
                            onPressSize(v);
                          }}
                        />
                      ))}
                    </SpaceBetweenDescription>
                    <Spacer height={15} />
                    {productData?.is_active === 0 ? (
                      <Row style={{ justifyContent: 'center', margin: 20 }}>
                        <Text color='#888'>판매 종료된 상품입니다.</Text>
                      </Row>
                    ) : (
                      <Row style={{ justifyContent: 'center' }}>
                        <Button
                          width={122}
                          backgroundColor={'#fff'}
                          borderColor={'rgb(0,175,240)'}
                          fontColor={'rgb(0,175,240)'}
                          onPress={addToCart}
                          disabled={productData?.is_active === 0}>
                          장바구니
                        </Button>
                        <Spacer width={20} />
                        <Button
                          width={122}
                          onPress={buyNow}
                          disabled={productData?.is_active === 0}>
                          바로구매
                        </Button>
                      </Row>
                    )}
                    <Spacer height={17} />
                  </View>
                </View>
                <View style={styles.spacer} />
                <Spacer height={30} />
                {productData?.description && (
                  <>
                    <AutoHeightWebView
                      style={{ width: deviceWidth }}
                      source={{ html: `<img src='${productData.description}' style='width: 100%;'/>` }}
                      viewportContent={'width=device-width, user-scalable=no'}
                      startInLoadingState={true}
                      renderLoading={() => {
                        return <Spinner />;
                      }}
                    />
                  </>
                )}
                {/* <Spacer height={50} /> */}
              </>
            ) : (
              <NoData />
            )}
          </>
        )}
      </ScrollView>
    </WhiteSafeArea>
  );
}

const styles = {
  spacer: {
    height: 17,
    backgroundColor: 'rgb(238,238,238)',
    borderColor: 'rgb(220,220,220)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
};
const OptionItem = ({ isSelected, onPress, data }) => {
  return (
    <OptionItemComponent
      onPress={onPress}
      isSelected={isSelected}>
      <Text
        style={{
          color: isSelected ? COLOR.PRIMARY : 'rgb(124,124,124)',
          fontSize: 14,
        }}>
        {data.name}
      </Text>
    </OptionItemComponent>
  );
};
const OptionItemComponent = styled.Pressable`
  min-width: 90px;
  padding: 0 10px;
  height: 31px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 10px;
  border-color: rgba(124, 124, 124, 1);
  border-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${({ isSelected }) => (isSelected ? `backgroundColor:#fafafa;borderColor:${COLOR.PRIMARY}` : ``)}
`;

ProductDetailPage = withContext(ProductDetailPage);
export default ProductDetailPage;
