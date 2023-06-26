import React, { useCallback, useState } from 'react';
import { Alert, BackHandler, Text } from 'react-native';
import IMP from 'iamport-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CART_KEY } from '@env';
import { withContext } from 'context-q';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';

import { Spinner } from '../../atoms/image';
import postOrder from '../../net/order/postOrder';
import { WhiteSafeArea } from '../../components/layouts';

export function IMPPaymentPage(props) {
  const navigation = useNavigation();
  const { method, orderData } = props.route.params;
  const [loading, setLoading] = useState(true);

  /* [필수입력] 결제에 필요한 데이터를 입력합니다. */
  const filteredData = {
    pg: method === 'phone' ? 'danal' : 'danal_tpay',
    pay_method: method,
    name: orderData?.subject,
    merchant_uid: `mid_${new Date().getTime()}`,
    amount: `${orderData?.totalAmounts}`,
    biz_num: '1738801678',
    buyer_name: orderData?.buyerInfo.name,
    buyer_tel: orderData?.buyerInfo.phone,
    buyer_email: orderData?.buyerInfo.email,
    buyer_addr: orderData?.address + ' ' + orderData?.address_detail,
    buyer_postcode: orderData?.zipcode,
    digital: false, // 휴대폰소액결제시 필수. 반드시 실물/컨텐츠를 정확히 구분해주어야 함
    app_scheme: 'example',
    // [Deprecated v1.0.3]: m_redirect_url
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
      return () => setLoading(true);
    }, [props.route.params?.params]),
  );
  /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
  const callback = async (response) => {
    if (response.success || response.imp_success === 'true') {
      await sendPayData(orderData);

      navigation.dispatch((state) => {
        return CommonActions.reset({
          index: 1,
          actions: [
            navigation.navigate('Home'),
            navigation.navigate('PaymentHistory', {
              screen: 'PaymentHistory',
            }),
          ],
        });
      });
    } else {
      fail(response.error_msg);
    }
  };

  const sendPayData = async (orderBody) => {
    const orderJson = JSON.stringify(orderBody);
    await postOrder(orderJson);

    let filteredCartData = props.context.cartData?.filter((x) => {
      const _key = `${x.color_id}_${x.size_id}`;
      return !orderBody.products.some((y) => _key === `${y.color_id}_${y.size_id}`);
    });
    updateCartContext(filteredCartData);
  };

  const updateCartContext = (_cartData) => {
    props.context.update({
      ...props.context,
      cartData: _cartData,
    });

    AsyncStorage.setItem(CART_KEY, JSON.stringify(_cartData));
  };

  const fail = (msg) => {
    Alert.alert('IMP 결제 실패', msg || '주문을 처리할 수 없습니다.');
    navigation.goBack();
    return false;
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

  if (loading) {
    return (
      <WhiteSafeArea>
        <Spinner />
      </WhiteSafeArea>
    );
  }
  return (
    <WhiteSafeArea>
      {filteredData ? (
        <IMP.Payment
          userCode={'imp56210527'} // 가맹점 식별코드
          loading={<Spinner />} // 웹뷰 로딩 컴포넌트
          data={filteredData} // 결제 데이터
          callback={callback} // 결제 종료 후 콜백
        />
      ) : (
        <Text>'오류가 발생했습니다.'</Text>
      )}
    </WhiteSafeArea>
  );
}

IMPPaymentPage = withContext(IMPPaymentPage);
export default IMPPaymentPage;
