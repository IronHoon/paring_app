import React, { useCallback, useMemo, useState } from 'react';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert, BackHandler, ScrollView, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { withContext } from 'context-q';
import _ from 'lodash';

import COLOR from '../../../constants/COLOR';
import { Button, SmallButton, SquareButton } from '../../atoms/button';
import { GraySpace, Hr, Row, SpaceBetweenRow, Spacer } from '../../atoms/layout';
import { Checkbox, RoundLabeledInput } from '../../atoms/form';
import { Bold, Text } from '../../atoms/text';
import { NavHead, WhiteSafeArea } from '../../components/layouts';
import ItemSummary from '../mypage/component/ItemSummary';
import SearchAddress from './component/SearchAddress';
import { Spinner } from '../../atoms/image';
import getMetaData from '../../net/meta/getMetaData';
import validateEmail from '../../utils/validateEmail';
import LoadingCover from '../../atoms/LoadingCover';
import getProduct from '../../net/product/getProduct';
import AgreementModal from '../../components/modal/AgreementModal';

function PaymentPage(props) {
  const navigation = useNavigation();

  const [orderData, setOrderData] = useState({});
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [showAgreementPopup, setShowAgreementPopup] = useState(false);
  const [agreementPopupType, setAgreementPopupType] = useState(null);
  const [useSameInfo, setUseSameInfo] = useState(false);
  const [agree, setAgree] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const init = () => {
    setUseSameInfo(false);
    setAgree(false);
    setPaymentMethod(null);
    setLoading(false);
    setOrderData({
      buyerInfo: {},
      recipientInfo: {},
      ...props.route.params.data,
    });
  };
  useFocusEffect(
    useCallback(() => {
      checkIsCommerce();
      if (orderData?.products) {
      } else {
        if (props.route.params.data) {
          init();
        } else {
          Alert.alert('', '올바르지 않은 경로 입니다.');
          navigation.goBack();
        }
      }
    }, [props?.route?.params]),
  );
  const onBackPress = () => {
    Alert.alert('', '페이지에서 나가시겠습니까?', [
      {
        text: '나가기',
        style: 'cancel',
        onPress: async () => {
          init();
          navigation.goBack();
          navigation.setParams({ data: null });
        },
      },
      { text: '머무르기', onPress: () => {} },
    ]);
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const checkValid = useMemo(() => {
    if (!orderData.buyerInfo?.name || !orderData.buyerInfo?.email || !orderData.buyerInfo?.phone) {
      return false;
    }
    if (!orderData.recipientInfo?.name || !orderData.recipientInfo?.phone) {
      return false;
    }
    if (!orderData.address || !orderData.address_detail || !orderData.zipcode) {
      return false;
    }
    return true;
  }, [orderData]);

  const checkIsCommerce = async () => {
    //check is_commerce
    const [commerceResponse] = await getMetaData('is_commerce');
    const _commerceResponse = commerceResponse.string === 'true';
    if (props.context.commerce !== _commerceResponse) {
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
    }
  };
  const onPressPay = async () => {
    try {
      setLoadingPayment(true);
      if (!validateEmail(orderData.buyerInfo.email)) return Alert.alert('', '올바른 이메일 형식이 아닙니다.');
      if (!paymentMethod) {
        Alert.alert('', '결제 수단을 선택해주세요.');
        return false;
      }
      if (!agree) {
        Alert.alert('', '결제 필수사항에 동의해주세요.');
        return false;
      }

      const areActiveProducts = true;
      const rpsData = await Promise.all(
        orderData.products?.map?.(async (v) => {
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
          if (!rps.is_active) areActiveProducts(false);
          return newData;
        }),
      );
      if (
        !_.isEqual(
          {
            unit_amount: orderData.products.unit_amount,
            delivery_fee: orderData.products.delivery_fee,
          },
          {
            unit_amount: rpsData.unit_amount,
            delivery_fee: rpsData.delivery_fee,
          },
        )
      ) {
        Alert.alert('', '주문요청 상품의 정보가 변경되었습니다.');
        navigation.goBack();
        return false;
      }

      let orderBody = getFilteredOrderData(orderData);

      navigation.navigate('IMPPayment', {
        screen: 'IMPPayment',
        params: {
          method: paymentMethod,
          orderData: orderBody,
        },
      });
    } catch (error) {
      setLoadingPayment(false);
      Alert.alert(
        '',
        '주문을 처리할 수 없습니다. \n\n불편을 드려서 죄송합니다.\n\n관리자에게 문의하세요. \n\nhttps://pairing.kr/app-ask',
      );
      console.warn('Payment - onPressPay', error, error.response, orderData);
    } finally {
      setLoadingPayment(false);
    }
  };

  const getFilteredOrderData = (_orderData) => {
    let orderBody = { ..._orderData };
    const productLen = orderBody.products.length;
    orderBody.subject = orderBody.products[0].product_data.product_name;
    if (productLen > 1) orderBody.subject = `${orderBody.subject} 외 ${productLen - 1}건`;
    orderBody.products = orderBody.products.map((v) =>
      _.pick(v, ['id', 'count', 'color_id', 'delivery_fee', 'size_id', 'unit_amount', 'origin_delivery_fee']),
    );

    return orderBody;
  };

  const handleAddressPopup = (b) => {
    setShowAddressPopup(b);
  };

  const handleUseSameInfo = (b) => {
    if (b) {
      if (!orderData.buyerInfo?.name) {
        alert('주문자 이름을 입력해주세요. ');
        return false;
      }
      if (!orderData.buyerInfo?.phone) {
        alert('주문자 연락처를 입력해주세요. ');
        return false;
      }
      setOrderData({
        ...orderData,
        recipientInfo: {
          ...orderData.recipientInfo,
          name: orderData.buyerInfo.name,
          phone: orderData.buyerInfo.phone,
        },
      });
    } else {
      setOrderData({
        ...orderData,
        recipientInfo: {
          ...orderData.recipientInfo,
          name: '',
          phone: '',
        },
      });
    }
    setUseSameInfo(b);
  };

  return (
    <WhiteSafeArea>
      <NavHead title={'주문하기'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <GraySpace />
        <Section>
          <Title>주문자 정보</Title>
          <RoundLabeledInput
            hasMargin
            label={'이름'}
            placeholder={'이름을 입력해주세요'}
            value={orderData.buyerInfo?.name}
            onChangeText={(v) => {
              setOrderData({
                ...orderData,
                buyerInfo: {
                  ...orderData.buyerInfo,
                  name: v,
                },
                recipientInfo: {
                  ...orderData.recipientInfo,
                  name: useSameInfo ? v : orderData.recipientInfo?.name,
                },
              });
            }}
          />
          <RoundLabeledInput
            hasMargin
            label={'연락처'}
            keyboardType='numeric'
            placeholder={'- 를 제외한 숫자를 입력해주세요'}
            value={orderData.buyerInfo?.phone}
            onChangeText={(v) => {
              setOrderData({
                ...orderData,
                buyerInfo: {
                  ...orderData.buyerInfo,
                  phone: v,
                },
                recipientInfo: {
                  ...orderData.recipientInfo,
                  phone: useSameInfo ? v : orderData.recipientInfo?.phone,
                },
              });
            }}
          />
          <RoundLabeledInput
            hasMargin
            keyboardType={'email-address'}
            label={'이메일'}
            placeholder={'이메일을 입력해주세요'}
            value={orderData.buyerInfo?.email}
            onChangeText={(v) => {
              setOrderData({
                ...orderData,
                buyerInfo: {
                  ...orderData.buyerInfo,
                  email: v,
                },
              });
            }}
          />
        </Section>
        <GraySpace />

        <Section>
          <Title>배송 정보</Title>
          <RoundLabeledInput
            hasMargin
            disabled={useSameInfo}
            label={'이름'}
            placeholder={'이름을 입력해주세요'}
            value={orderData.recipientInfo?.name}
            onChangeText={(v) => {
              setOrderData({
                ...orderData,
                recipientInfo: {
                  ...orderData.recipientInfo,
                  name: v,
                },
              });
            }}
          />
          <RoundLabeledInput
            hasMargin
            disabled={useSameInfo}
            label={'연락처'}
            placeholder={'- 를 제외한 숫자를 입력해주세요'}
            value={orderData.recipientInfo?.phone}
            onChangeText={(v) => {
              setOrderData({
                ...orderData,
                recipientInfo: {
                  ...orderData.recipientInfo,
                  phone: v,
                },
              });
            }}
          />
          <Spacer height={5} />
          <Row>
            <Checkbox
              checked={useSameInfo}
              setChecked={handleUseSameInfo}
            />
            <Spacer width={6} />
            <Text
              size={14}
              style={{ color: 'rgba(90,90,90,1)' }}>
              주문자 정보와 동일
            </Text>
          </Row>

          <Spacer height={47} />
          <Title>배송지</Title>
          <Row>
            <RoundLabeledInput
              full
              editable={false}
              placeholder={'주소 찾기를 해주세요'}
              value={orderData.address}
              onPress={() => {
                handleAddressPopup(!showAddressPopup);
              }}
            />
            <Spacer width={10} />
            <SmallButton
              onPress={() => {
                handleAddressPopup(!showAddressPopup);
              }}
              styles={{ container: { height: 28 } }}>
              주소찾기
            </SmallButton>
          </Row>
          <Spacer height={11} />
          <RoundLabeledInput
            full
            placeholder={'상세 주소 입력'}
            value={orderData.address_detail}
            onChangeText={(v) => {
              setOrderData({
                ...orderData,
                address_detail: v,
              });
            }}
          />
        </Section>
        <GraySpace />

        <Section>
          <Title>주문 상품 내역</Title>
          {orderData?.products &&
            orderData.products.map((item, index) => {
              return (
                <View key={`${item.color_id}_${item.size_id}`}>
                  <ItemSummary {...item} />
                  <Spacer height={11} />
                </View>
              );
            })}
        </Section>
        <GraySpace />

        <Section>
          <Title>결제 정보</Title>
          <Spacer height={6} />
          <InfoRow>
            <GrayText>총 상품금액</GrayText>
            <GrayText>{formatNumber(orderData.amounts)}원</GrayText>
          </InfoRow>
          <InfoRow>
            <GrayText>총 배송금액</GrayText>
            <GrayText>{formatNumber(orderData.delivery_fee)}원</GrayText>
          </InfoRow>
          <Hr color={COLOR.BORDER} />
          <Spacer height={6} />
          <InfoRow>
            <Bold size={14}>총 결제금액</Bold>
            <Text
              size={14}
              color={COLOR.PRIMARY}
              style={{ flex: 1, textAlign: 'right' }}>
              {formatNumber(orderData.totalAmounts)}원
            </Text>
          </InfoRow>
        </Section>
        <GraySpace />

        <Section>
          <Title>결제 수단</Title>
          <PaymentMethodArea>
            <PaymentTypeButton
              backgroundColor={paymentMethod !== null && paymentMethod !== 'vbank' && COLOR.LIGHT_GRAY}
              onPress={() => {
                setPaymentMethod('vbank');
              }}>
              가상계좌
            </PaymentTypeButton>
            <PaymentTypeButton
              backgroundColor={paymentMethod !== null && paymentMethod !== 'trans' && COLOR.LIGHT_GRAY}
              onPress={() => {
                setPaymentMethod('trans');
              }}>
              실시간계좌이체
            </PaymentTypeButton>
            <PaymentTypeButton
              backgroundColor={paymentMethod !== null && paymentMethod !== 'phone' && COLOR.LIGHT_GRAY}
              onPress={() => {
                setPaymentMethod('phone');
              }}>
              휴대폰
            </PaymentTypeButton>
            <PaymentTypeButton
              backgroundColor={paymentMethod !== null && paymentMethod !== 'card' && COLOR.LIGHT_GRAY}
              onPress={() => {
                setPaymentMethod('card');
              }}>
              신용/체크카드
            </PaymentTypeButton>
          </PaymentMethodArea>
        </Section>
        <GraySpace />

        <Section>
          <Row centered>
            <Checkbox
              checked={agree}
              setChecked={(v) => setAgree(v)}
            />
            <Spacer width={8} />
            <GrayText style={{ color: '#5a5a5a' }}>결제시 필수사항 동의</GrayText>
          </Row>
          <Spacer height={27} />
          <AgreementButton
            label='상품구매조건 및 취소 / 환불 규정'
            onPress={() => {
              setAgreementPopupType('payment');
              setShowAgreementPopup(true);
            }}
          />
          <AgreementButton
            label='개인정보 제 3자 제공 동의'
            onPress={() => {
              setAgreementPopupType('personalInformation');
              setShowAgreementPopup(true);
            }}
          />
          <AgreementButton label='만 14세 이상 결제 동의' />
          <AgreementModal
            type={agreementPopupType}
            visible={showAgreementPopup}
            onClose={() => setShowAgreementPopup(false)}
          />
        </Section>
      </ScrollView>
      <SquareButton
        disabled={!checkValid || loading}
        onPress={onPressPay}>
        {loading ? <Spinner /> : <>{formatNumber(orderData.totalAmounts)}원 결제하기</>}
      </SquareButton>
      {showAddressPopup && (
        <SearchAddress
          onClose={() => handleAddressPopup(false)}
          onChange={(v) => {
            setOrderData({
              ...orderData,
              address: v.address,
              zipcode: v.zonecode,
            });
          }}
        />
      )}
      {loadingPayment && <LoadingCover text={`주문서를 확인하고 있습니다\n잠시만 기다려주세요`} />}
    </WhiteSafeArea>
  );
}
const AgreementButton = ({ label, onPress }) => {
  return (
    <>
      <SpaceBetweenRow
        style={{
          paddingHorizontal: 31,
        }}>
        <GrayText>{label}</GrayText>
        {onPress && (
          <TouchableOpacity
            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            onPress={onPress}>
            <GrayText>보기</GrayText>
          </TouchableOpacity>
        )}
      </SpaceBetweenRow>
      <Spacer height={12} />
    </>
  );
};

const formatNumber = (n) => {
  return new Intl.NumberFormat().format(n || 0);
};

const Section = styled.View`
  padding-vertical: 30px;
  padding-horizontal: 18px;
`;
const Title = styled.Text`
  margin-bottom: 14px;
  font-size: 18px;
`;

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
const PaymentMethodArea = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: -12px;
`;
const PaymentTypeButton = styled(Button).attrs({
  styles: {
    container: {
      width: '49%',
      marginBottom: 12,
    },
  },
})``;

PaymentPage = withContext(PaymentPage);
export default PaymentPage;
