import React, { useCallback, useMemo, useState } from 'react';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { BackHandler, FlatList } from 'react-native';
import styled from 'styled-components';
import { withContext } from 'context-q';
import _ from 'lodash';
import { CART_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import COLOR from '../../../../constants/COLOR';
import { Hr, Row, Spacer } from '../../../atoms/layout';
import { Bold, Text } from '../../../atoms/text';
import { Button } from '../../../atoms/button';
import WhiteSafeArea from '../../../components/layouts/WhiteSafeArea';
import { NavHead } from '../../../components/layouts';
import getMetaData from '../../../net/meta/getMetaData';
import getProduct from '../../../net/product/getProduct';
import CartItem from '../component/CartItem';
import { Spinner } from '../../../atoms/image';

function CartPage(props) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [selectedId, setSelectedId] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await checkIsCommerce();
        await updateCartData();
      })();
      return () => {
        setLoading(true);
      };
    }, [props.route?.params, props.context?.cartData]),
  );

  const updateCartData = async () => {
    const [updatedCartData, isChanged] = await getCurrentCartInfo(props.context?.cartData);
    setCartData(updatedCartData || []);
    setSelectedId((updatedCartData || []).filter((x) => !x.is_active).map((x) => `${x.color_id}_${x.size_id}`));
    setLoading(false);
  };

  const checkIsCommerce = async () => {
    // check is_commerce
    const [commerceResponse] = await getMetaData('is_commerce');
    const _commerceResponse = commerceResponse.string === 'true';
    props.context.update({
      ...props.context,
      commerce: _commerceResponse,
    });

    if (!_commerceResponse) {
      navigation.dispatch((state) => {
        return CommonActions.reset({
          index: 0,
          actions: [navigation.navigate('Home')],
        });
      });
    }
  };

  const getCurrentCartInfo = async (_cartData) => {
    let isChanged = false;
    let data = await Promise.all(
      _cartData?.map?.(async (v) => {
        const [rps] = await getProduct(v.id);

        let newData = {
          ...v,
          is_active: rps.is_active,
          origin_delivery_fee: rps.delivery_fee,
          product_data: {
            ...v.product_data,
            product_name: rps.name,
            thumbnail: rps.thumbnail,
          },
          unit_amount: rps.price,
        };
        if (!_.isEqual(newData, v)) isChanged = true;
        return { ...newData };
      }),
    );
    return [data, isChanged];
  };

  const totalData = useMemo(() => {
    let products = [],
      amounts = 0,
      delivery_fee = 0;
    if (cartData.length > 0) {
      products = cartData.filter((x) => selectedId.some?.((y) => y === `${x.color_id}_${x.size_id}`));
      amounts = _.sumBy(products, (x) => x.unit_amount * x.count);

      let arrFilteredSameId = [];
      products = products.map((x) => {
        let rst = { ...x };
        const hasSameId = arrFilteredSameId.some?.((y) => y.id === x.id);
        if (arrFilteredSameId.length === 0 || !hasSameId) {
          arrFilteredSameId.push(x);
          rst.delivery_fee = x.origin_delivery_fee;
        } else {
          rst.delivery_fee = 0;
        }
        return rst;
      });
      delivery_fee = _.sumBy(arrFilteredSameId, (x) => x.origin_delivery_fee);
    }
    return {
      amounts,
      delivery_fee,
      products,
      origin_delivery_fee: _.sumBy(products, (x) => x.origin_delivery_fee),
      totalAmounts: amounts + delivery_fee,
    };
  }, [cartData, selectedId]);

  const formatNumber = (n) => {
    return new Intl.NumberFormat().format(n || 0);
  };

  const updateCartContext = (_cartData) => {
    props.context.update({
      ...props.context,
      cartData: _cartData,
    });

    AsyncStorage.setItem(CART_KEY, JSON.stringify(_cartData));
  };

  const onChangeAmount = (item, cnt) => {
    let res = cartData.map((x) => {
      let y = { ...x };
      if (x.size_id === item.size_id && x.color_id === item.color_id) y.count = cnt;
      return y;
    });
    updateCartContext(res);
  };
  const onPressItem = (product_id) => {
    navigation.navigate('ProductDetail', {
      screen: 'ProductDetail',
      params: {
        product_id,
      },
    });
  };
  const onPressBuyNow = (item) => {
    navigation.navigate('Payment', {
      from: 'Cart',
      screen: 'Payment',
      params: {
        data: {
          amounts: item.unit_amount * item.count,
          delivery_fee: item.origin_delivery_fee,
          origin_delivery_fee: item.origin_delivery_fee,
          products: [item],
          totalAmounts: item.unit_amount * item.count + item.origin_delivery_fee,
        },
      },
    });
  };
  const onPressBuySelectedItems = ({ amounts, delivery_fee, origin_delivery_fee, products, totalAmounts }) => {
    navigation.navigate('Payment', {
      from: 'Cart',
      screen: 'Payment',
      params: {
        data: {
          amounts,
          delivery_fee,
          origin_delivery_fee,
          products,
          totalAmounts,
        },
      },
    });
  };
  const handleSelectedItems = (item, value) => {
    if (value && !!item.is_active) {
      setSelectedId([...selectedId, `${item.color_id}_${item.size_id}`]);
    } else {
      setSelectedId(selectedId.filter((x) => x !== `${item.color_id}_${item.size_id}`));
    }
  };
  const onPressRemove = (item) => {
    updateCartContext(cartData.filter((x) => x.color_id !== item.color_id || x.size_id !== item.size_id));
    handleSelectedItems(item, false);
  };

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
      <NavHead title={'장바구니'} />
      {loading ? (
        <Spinner />
      ) : (
        <FlatList
          keyExtractor={(item) => `${item.color_id}_${item.size_id}`}
          data={cartData || []}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              cartData={cartData}
              selected={selectedId.some((x) => x === `${item.color_id}_${item.size_id}`)}
              loading={loading}
              onPressItem={onPressItem}
              onPressBuyNow={onPressBuyNow}
              onPressRemove={onPressRemove}
              onChangeAmount={onChangeAmount}
              handleSelectedItems={(x) => handleSelectedItems(item, x)}
            />
          )}
        />
      )}
      <TotalPriceWrapper>
        <InfoRow>
          <GrayText size={14}>총 상품금액</GrayText>
          <GrayText size={14}>{formatNumber(totalData.amounts)}원</GrayText>
        </InfoRow>
        <InfoRow>
          <GrayText size={14}>총 배송금액</GrayText>
          <Row style={{ alignItems: 'center' }}>
            {totalData.origin_delivery_fee !== totalData.delivery_fee && (
              <GrayText
                style={{
                  color: '#bbb',
                  fontSize: 13,
                  textDecorationLine: 'line-through',
                }}>
                {formatNumber(totalData.origin_delivery_fee)}
              </GrayText>
            )}
            <Spacer width={8} />
            <GrayText size={14}>{formatNumber(totalData.delivery_fee)}원</GrayText>
          </Row>
        </InfoRow>
        <Hr />
        <Spacer height={6} />
        <InfoRow>
          <Bold size={14}>총 결제금액</Bold>
          <Text
            size={14}
            style={{ color: COLOR.PRIMARY, flex: 1, textAlign: 'right' }}>
            {formatNumber(totalData.totalAmounts)}원
          </Text>
        </InfoRow>
        <Spacer height={2} />
        <Button
          disabled={selectedId?.length < 1 || loading}
          onPress={() => onPressBuySelectedItems(totalData)}>
          선택상품 구매
        </Button>
      </TotalPriceWrapper>
    </WhiteSafeArea>
  );
  품;
}

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;
const GrayText = styled.Text`
  font-size: 14px;
  color: rgba(124, 124, 124, 1);
  letter-spacing: -0.35px;
`;
const TotalPriceWrapper = styled.View`
  padding-horizontal: 18px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top-width: 1px;
  border-color: ${COLOR.BORDER};
`;

CartPage = withContext(CartPage);
export default CartPage;
